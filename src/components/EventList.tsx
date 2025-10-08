import { prisma } from "@/lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        lte: new Date(endOfDay.setHours(23, 59, 59, 999)),
      },
      endTime: {
        gte: new Date(startOfDay.setHours(0, 0, 0, 0)),
      },
    },
  });

  const dateValidation = (startTime: Date, endTime: Date) => {
    const startDate = new Intl.DateTimeFormat("id-ID").format(startTime);
    const endDate = new Intl.DateTimeFormat("id-ID").format(endTime);

    if (startDate === endDate) {
      return (
        <span className="text-gray-300 text-xs">
          {startTime.toLocaleDateString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}{" "}
          -{" "}
          {new Date(endTime).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      );
    } else {
      return (
        <span className="text-gray-300 text-xs">
          {startTime.toLocaleDateString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}{" "}
          -{" "}
          {new Date(endTime).toLocaleDateString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      );
    }
  };

  return data.map((event) => (
    <div
      className="p-5 rounded-md border-2 border-gray-100 border-t-4
             odd:border-t-pickSky even:border-t-pickPurple"
      key={event.id}
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{event.title}</h1>
        {dateValidation(event.startTime, event.endTime)}
      </div>
      <p className="mt-2 text-gray-400 text-sm">
        {event.description.length > 100
          ? `${event.description.substring(0, 100)}...`
          : event.description}
      </p>
    </div>
  ));
};

export default EventList;
