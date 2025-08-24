"use client";

import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const FallbackImage = ({ 
  src, 
  fallbackSrc, 
  alt, 
  fill = false, 
  className = "", 
  width,
  height
}: FallbackImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      onError={() => setImgSrc(fallbackSrc)}
    />
  );
};

export default FallbackImage;
