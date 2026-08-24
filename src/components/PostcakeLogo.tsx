import React from 'react';

interface PostcakeLogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
}

export const PostcakeLogo: React.FC<PostcakeLogoProps> = ({
  className = '',
  iconSize = 32,
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <img
        src="/postcake-wordmark-dark.png"
        alt="Postcake"
        className="h-8 w-auto object-contain"
        onError={(e) => {
          // Fallback to text if asset missing
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
      {!showText && (
        <span className="font-display font-black text-white text-lg tracking-tight">
          Postcake<span className="text-[#FF7A00]">.io</span>
        </span>
      )}
    </div>
  );
};

export const PostcakeIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  return (
    <img
      src="/postcake-icon.png"
      alt="Postcake Icon"
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
    />
  );
};
