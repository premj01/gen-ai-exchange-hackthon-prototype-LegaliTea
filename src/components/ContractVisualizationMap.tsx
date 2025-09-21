import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedCard } from "@/components/ui/animated-card";
import { useAnimations } from "@/hooks/useAnimations";
import { useAudioFeedback } from "@/services/audioFeedback";
import type { ContractVisualization } from "@/types/advanced";

interface ContractVisualizationMapProps {
  visualization: ContractVisualization;
  onNodeClick?: (nodeId: string) => void;
  onRelationshipClick?: (relationship: any) => void;
  className?: string;
}

export const ContractVisualizationMap: React.FC<
  ContractVisualizationMapProps
> = ({ visualization, onNodeClick, onRelationshipClick, className = "" }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mermaidError, setMermaidError] = useState<string | null>(null);

  const mermaidRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { getAnimationClass } = useAnimations();
  const { playClick, playSuccess, playError } = useAudioFeedback();

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
        padding: 20,
      },
      themeVariables: {
        primaryColor: "#3b82f6",
        primaryTextColor: "#1f2937",
        primaryBorderColor: "#2563eb",
        lineColor: "#6b7280",
        secondaryColor: "#f3f4f6",
        tertiaryColor: "#ffffff",
      },
    });
  }, []);

  // Render Mermaid diagram
  useEffect(() => {
    if (!mermaidRef.current || !visualization.mermaidDiagram) return;

    const renderDiagram = async () => {
      try {
        setMermaidError(null);

        // Clear previous content
        // mermaid/Ref.current.innerHTML = "";
        if (!mermaidRef.current) return;
        mermaidRef.current.innerHTML = "";

        // Unique ID
        const diagramId = `mermaid-${Date.now()}`;

        // Mermaid v10+ returns string, not object
        const svg = await mermaid.render(
          diagramId,
          visualization.mermaidDiagram
        );

        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;

          // Node click handlers
          const nodes =
            mermaidRef.current.querySelectorAll<SVGElement>(".node");
          nodes.forEach((node) => {
            const nodeId = node.id?.replace(diagramId + "-", "");
            if (nodeId) {
              node.addEventListener("click", () => handleNodeClick(nodeId));
              node.style.cursor = "pointer";
            }
          });

          // Edge click handlers
          const edges =
            mermaidRef.current.querySelectorAll<SVGElement>(".edgePath");
          edges.forEach((edge, index) => {
            edge.addEventListener("click", () =>
              handleRelationshipClick(index)
            );
            edge.style.cursor = "pointer";
          });

          playSuccess();
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error);
        setMermaidError(
          "Failed to render contract visualization. Please try again."
        );
        playError();
      }
    };

    renderDiagram();
  }, [visualization.mermaidDiagram, filterType]);

  const handleNodeClick = (nodeId: string) => {
    playClick();
    setSelectedNode(nodeId);
    onNodeClick?.(nodeId);
  };

  const handleRelationshipClick = (relationshipIndex: number) => {
    playClick();
    const relationship = visualization.relationships[relationshipIndex];
    onRelationshipClick?.(relationship);
  };

  const handleZoom = (direction: "in" | "out" | "reset") => {
    playClick();
    if (direction === "reset") {
      setZoomLevel(1);
    } else {
      const newZoom =
        direction === "in"
          ? Math.min(zoomLevel * 1.2, 3)
          : Math.max(zoomLevel / 1.2, 0.3);
      setZoomLevel(newZoom);
    }
  };

  const toggleFullscreen = () => {
    playClick();
    setIsFullscreen(!isFullscreen);
  };

  const exportDiagram = () => {
    playClick();
    if (!mermaidRef.current) return;

    const svg = mermaidRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "contract-map.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);

    playSuccess();
  };

  const filteredNodes = visualization.nodes.filter((node) => {
    const matchesType = filterType === "all" || node.type === filterType;
    const matchesSearch =
      !searchTerm ||
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case "party":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "obligation":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "deadline":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "payment":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "condition":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "penalty":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (!visualization.mermaidDiagram) {
    return (
      <AnimatedCard className="p-8 text-center">
        <div className="text-muted-foreground">
          <Filter className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No Visualization Available
          </h3>
          <p>Contract mapping is not available for this document.</p>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Controls, Main Visualization, Node Panel */}
      {/* Keep your previous JSX unchanged */}
    </div>
  );
};
