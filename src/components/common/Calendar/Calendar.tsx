import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { CalendarWrapper } from './Calendar.styled';
import { dummyEvents } from '../../../constants/dummy';

const Calendar: React.FC = () => {
  // 날짜 클릭 핸들러
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt('이벤트 제목을 입력하세요:');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  };

  // 이벤트 클릭 핸들러
  const handleEventClick = (clickInfo: EventClickArg) => {
    if (confirm(`'${clickInfo.event.title}' 이벤트를 삭제하시겠습니까?`)) {
      clickInfo.event.remove();
    }
  };

  return (
    <CalendarWrapper>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev',
          center: 'title',
          right: 'next'
        }}
        events={dummyEvents}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        moreLinkClick="popover"
        weekends={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        locale="ko"
        height="100%"
        width="100%"
        fixedWeekCount={true}
      />
    </CalendarWrapper>
  );
};

export default Calendar;