import Skeleton from "./Skeleton.jsx";

function LoadingState({
  count = 6,
  height = "200px",
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map(
        (_, index) => (
          <Skeleton
            key={index}
            height={height}
          />
        )
      )}
    </div>
  );
}

export default LoadingState;