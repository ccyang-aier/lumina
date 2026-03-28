import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="flex flex-col w-full h-full">
      {/* 主内容区域 - 增加容器限制 */}
      <div className="flex-1 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题区占位 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-[200px] sm:w-[300px]" />
            <Skeleton className="h-4 w-[150px] sm:w-[250px]" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-[120px]" />
          </div>
        </div>

        {/* 主要内容网格占位 */}
        <div className="space-y-8">
          {/* 统计卡片行 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[120px] rounded-xl" />
            ))}
          </div>

          {/* 复杂布局区 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
