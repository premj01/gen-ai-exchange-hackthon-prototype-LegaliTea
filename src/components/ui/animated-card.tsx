import React from "react";
import { Card } from "./card";
import { useAnimations, useIntersectionAnimation } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.ComponentProps<"div"> {
  delay?: number;
  stagger?: boolean;
  hover?: boolean;
  loading?: boolean;
  animation?:
    | "fade-up"
    | "scale"
    | "slide-right"
    | "hover-lift"
    | "glow"
    | "slide-down";
}

// Helper object for animation classes
const animationStates = {
  initial: {
    "fade-up": "opacity-0 translate-y-4",
    scale: "opacity-0 scale-95",
    "slide-right": "opacity-0 translate-x-4",
    "slide-down": "opacity-0 -translate-y-4",
    default: "opacity-0",
  },
  animate: {
    "fade-up": "animate-fade-in-up",
    scale: "animate-scale-in",
    "slide-right": "animate-slide-in-right",
    "slide-down": "animate-slide-in-down",
    default: "animate-fade-in",
  },
  hover: {
    "hover-lift": "hover:-translate-y-2 hover:shadow-xl",
    glow: "hover:shadow-lg hover:shadow-primary/25",
    default: "hover:-translate-y-1 hover:shadow-lg",
  },
};

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    {
      className,
      animation = "fade-up",
      delay = 0,
      stagger = false,
      hover = true,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const { getAnimationClass } = useAnimations();
    const { ref: intersectionRef, isVisible } = useIntersectionAnimation();

    const getAnimationClasses = () => {
      const baseClasses = "transition-all duration-300 ease-out transform";

      if (loading) {
        return cn(baseClasses, "animate-skeleton-pulse");
      }

      const animType = animation || "default";

      const initialClass =
        animationStates.initial[
          animType as keyof typeof animationStates.initial
        ] || animationStates.initial.default;
      const animateClass = getAnimationClass(
        animationStates.animate[
          animType as keyof typeof animationStates.animate
        ] || animationStates.animate.default
      );

      let hoverClass = "";
      if (hover && isVisible) {
        hoverClass =
          getAnimationClass(
            animationStates.hover[
              animType as keyof typeof animationStates.hover
            ] || animationStates.hover.default
          ) + ` ${getAnimationClass("hover:border-primary/30")}`;
      }

      return cn(
        baseClasses,
        isVisible ? animateClass : initialClass,
        hoverClass
      );
    };

    const combinedRef = (node: HTMLDivElement) => {
      intersectionRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <Card
        ref={combinedRef}
        className={cn(getAnimationClasses(), className)}
        style={{
          animationDelay: `${delay}ms`,
          ...(props.style || {}),
        }}
        {...props}
      >
        {loading ? (
          <div className="space-y-3 p-6">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-20 w-full" />
          </div>
        ) : (
          children
        )}
      </Card>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

// ---------------- Staggered Cards ----------------

interface StaggeredCardsProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredCards: React.FC<StaggeredCardsProps> = ({
  children,
  staggerDelay = 100,
  className = "",
}) => {
  const { getAnimationClass } = useAnimations();

  return (
    <div
      className={cn(
        "stagger-fade-in",
        getAnimationClass("space-y-4"),
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<AnimatedCardProps>(child)) {
          return React.cloneElement(child, {
            delay: index * staggerDelay,
            stagger: true,
          });
        }
        return child;
      })}
    </div>
  );
};
