import React from 'react';

const pulse = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

const SkeletonBox = ({ width = '100%', height = 16, borderRadius = 8, style = {} }) => (
  <>
    <style>{pulse}</style>
    <div style={{
      width, height, borderRadius,
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style
    }} />
  </>
);

export const ProductSkeleton = () => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <SkeletonBox height={160} borderRadius={0} />
    <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SkeletonBox height={14} width="80%" />
      <SkeletonBox height={12} width="40%" />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <SkeletonBox height={20} width="30%" />
        <SkeletonBox height={30} width="25%" borderRadius={8} />
      </div>
    </div>
  </div>
);

export const RestaurantSkeleton = () => (
  <div className="card" style={{ overflow: 'hidden' }}>
    <SkeletonBox height={160} borderRadius={0} />
    <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SkeletonBox height={16} width="70%" />
      <SkeletonBox height={12} width="50%" />
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <SkeletonBox height={12} width="20%" />
        <SkeletonBox height={12} width="20%" />
        <SkeletonBox height={12} width="20%" />
      </div>
    </div>
  </div>
);

export const OrderSkeleton = () => (
  <div className="card card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <SkeletonBox height={16} width="40%" />
      <SkeletonBox height={22} width="20%" borderRadius={20} />
    </div>
    <SkeletonBox height={12} width="60%" />
    <SkeletonBox height={12} width="30%" />
  </div>
);

export const ProfileSkeleton = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
    <SkeletonBox width={70} height={70} borderRadius="50%" />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SkeletonBox height={18} width="50%" />
      <SkeletonBox height={13} width="35%" />
      <SkeletonBox height={20} width="25%" borderRadius={20} />
    </div>
  </div>
);

export default SkeletonBox;
