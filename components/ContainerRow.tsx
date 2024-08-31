import React from 'react';
import { View } from 'react-native';

export const ContainerRow: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <View className={`flex-row mx-1.5 mb-2 ${className}`}>{children}</View>;
};
