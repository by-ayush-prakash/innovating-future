import { initRecordInteractions } from "./record-interactions";
import { initRecordJourney } from "./record-journey";
import { initRecordNavigation } from "./record-navigation";
import { initRecordInquiry } from "./record-inquiry";
const initialized = new WeakSet<HTMLElement>();
export function initRecordApp() {
  const root = document.querySelector<HTMLElement>("[data-prototype]");
  if (!root || initialized.has(root)) return;
  initialized.add(root);
  initRecordJourney();
  initRecordNavigation();
  initRecordInquiry();
  initRecordInteractions(root);
}
