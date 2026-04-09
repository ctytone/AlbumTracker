import { LoadingGrid } from "@/components/loading-grid";

export default function AppLoading() {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <div className="h-8 w-40 rounded-md bg-muted" />
        <div className="h-4 w-72 rounded-md bg-muted" />
      </div>
      <LoadingGrid />
    </section>
  );
}
