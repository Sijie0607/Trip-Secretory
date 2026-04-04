import TripOpenV2Prototype from '@/components/trip-open-v2/TripOpenV2Prototype';

/**
 * V2 插画原型：嵌入主站 layout（全局 Navbar + Footer），子导航贴在顶栏下方
 */
export default function TripOpenV2Page() {
  return (
    <div className="bg-[#FFF8F0] w-full">
      <TripOpenV2Prototype embedded />
    </div>
  );
}
