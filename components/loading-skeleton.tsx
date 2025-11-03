export function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* 통계 스켈레톤 */}
      <div>
        <div className="h-6 bg-muted rounded w-32 mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-lg border border-border p-6 h-32"></div>
          ))}
        </div>
      </div>

      {/* 폼 스켈레톤 */}
      <div>
        <div className="h-6 bg-muted rounded w-32 mb-4"></div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 테이블 스켈레톤 */}
      <div>
        <div className="h-6 bg-muted rounded w-32 mb-4"></div>
        <div className="bg-card rounded-lg border border-border p-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

