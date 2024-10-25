import { EventDocument } from "@/type";
import { getThumbnailUrl } from "@/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

function EventItem({ item }: { item: EventDocument }) {
  const navigate = useNavigate();

  return (
    <div className="gap-2" onClick={() => navigate("/events/" + item.$id)}>
      <img
        src={getThumbnailUrl(item.thumbnail)}
        className="w-full rounded-sm aspect-[16/9]"
      />
      <div className="mt-1">
        <p className="font-semibold mb-1">{item.title}</p>
        <p className="text-xs text-zinc-500">
          {item.stream_id} - {item.description}
        </p>
        <p className="text-xs text-zinc-500">
          {format(item.$createdAt, "yyyy-MM-dd HH:mm:ss")}
        </p>
      </div>
    </div>
  );
}

export default EventItem;
