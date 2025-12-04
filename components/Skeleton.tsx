// components/Skeleton.tsx
import { View } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: any;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
  className = "",
}: SkeletonProps) {
  return (
    <View
      className={`bg-gray-200 animate-pulse ${className}`}
      style={[
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    />
  );
}

// Predefined skeleton components with proper spacing
export function SkeletonHeader() {
  return (
    <View className="mb-8 mt-2">
      <Skeleton width={120} height={24} borderRadius={20} className="mb-4" />
      <Skeleton width="70%" height={32} borderRadius={8} className="mb-3" />
      <Skeleton width={200} height={18} borderRadius={6} />
    </View>
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-4">
      <View className="flex-row items-center">
        <Skeleton width={48} height={48} borderRadius={12} className="mr-4" />
        <View className="flex-1">
          <Skeleton width="60%" height={20} borderRadius={6} className="mb-3" />
          <Skeleton width={100} height={14} borderRadius={4} />
        </View>
        <Skeleton width={24} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

export function SkeletonAccordion() {
  return (
    <View className="bg-white mb-5 rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <View className="bg-gray-50 p-5 border-b border-gray-100 flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <Skeleton width={40} height={40} borderRadius={12} className="mr-4" />
          <View className="flex-1">
            <Skeleton width="50%" height={20} borderRadius={6} className="mb-2" />
            <Skeleton width={120} height={14} borderRadius={4} />
          </View>
        </View>
        <Skeleton width={40} height={20} borderRadius={10} />
      </View>
      {/* Content */}
      <View className="p-4 bg-gray-50">
        {[1, 2, 3].map((i) => (
          <View 
            key={i} 
            className={`flex-row items-center py-4 ${i < 3 ? 'border-b border-gray-100' : ''}`}
          >
            <Skeleton width={24} height={24} borderRadius={12} className="mr-4" />
            <Skeleton width="70%" height={16} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
}

// New: Skeleton with consistent spacing
export function SkeletonWithSpacing() {
  return (
    <View className="space-y-4">
      <Skeleton width="100%" height={100} borderRadius={16} />
      <Skeleton width="100%" height={100} borderRadius={16} />
      <Skeleton width="100%" height={100} borderRadius={16} />
    </View>
  );
}