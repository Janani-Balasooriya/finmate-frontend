// Ensure Chart.js elements are registered once.
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

let registered = false;

export function ensureChartRegistration() {
  if (registered) return;
  ChartJS.register(ArcElement, Tooltip, Legend);
  registered = true;
}
