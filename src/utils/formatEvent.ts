import type { Event } from '@/types/fullCalendar';
import type { EventApi, EventInput } from '@fullcalendar/core';

export const formatEvents = (events: Event[]): EventInput[] => {
    return events.map((event) => {
        const endDate = new Date(event.endDate);
        endDate.setDate(endDate.getDate() + 1); // 하루 추가
        
        return {
            id: String(event.scheduleId),
            title: event.title,
            start: event.startDate,
            end: endDate.toISOString(),
            color: event.color,
            scheduleId: event.scheduleId,
            extendedProps: {
                scheduleId: event.scheduleId,
                description: event.content,
                assignees: event.users,
            }
        };
    });
};

export const formatApiEvents = (event: EventApi): EventInput => {
    const scheduleId = Number(
        event.extendedProps?.scheduleId ?? event.id ?? -1
    );

    return {
        id: String(scheduleId),
        title: event.title,
        start: event.start?.toISOString() ?? undefined,
        end: event.end?.toISOString() ?? event.start?.toISOString(),
        color: event.backgroundColor,
        scheduleId,
        extendedProps: {
            scheduleId,
            description: event.extendedProps?.description,
            assignees: event.extendedProps?.assignees,
        }
    }
}
