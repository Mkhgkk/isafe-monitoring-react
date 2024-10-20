import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import NotificationItem, {
  NotificationItemSkeleton,
} from "./notification-item";

const data = [
  {
    image: "https://via.placeholder.com/150",
    title: "No hat wearing",
    description: "No hat wearing detected",
    timestamp: new Date(),
    camera: "Camera 1",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "Unauthorized access",
    description: "Unauthorized access detected at the entrance",
    timestamp: new Date(),
    camera: "Camera 2",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "No safety vest",
    description: "Worker without safety vest detected",
    timestamp: new Date(),
    camera: "Camera 3",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "Slipping incident",
    description: "Slipping incident detected near construction zone",
    timestamp: new Date(),
    camera: "Camera 4",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "No face mask",
    description: "Worker without face mask detected in restricted area",
    timestamp: new Date(),
    camera: "Camera 5",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "Fire detected",
    description: "Fire detected in the storage area",
    timestamp: new Date(),
    camera: "Camera 6",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "Ladder usage violation",
    description: "Unsafe ladder usage detected",
    timestamp: new Date(),
    camera: "Camera 7",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "PPE violation",
    description: "Worker not wearing proper PPE detected",
    timestamp: new Date(),
    camera: "Camera 8",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "Equipment malfunction",
    description: "Malfunction detected in heavy equipment",
    timestamp: new Date(),
    camera: "Camera 9",
  },
  {
    image: "https://via.placeholder.com/150",
    title: "Unauthorized vehicle",
    description: "Unauthorized vehicle detected in restricted area",
    timestamp: new Date(),
    camera: "Camera 10",
  },
];

function NotificationPanel({ trigger }: { trigger: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="max-h-full border flex flex-col pb-0">
        <SheetHeader>
          <div className="flex gap-2 items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            <Button variant="outline" size="sm">
              Clear all
            </Button>
          </div>
        </SheetHeader>

        <div className="grid gap-y-2 overflow-scroll flex-1  pb-5">
          {/* <NotificationItemSkeleton /> */}
          {data.map((item, index) => (
            <NotificationItem item={item} key={index} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationPanel;
