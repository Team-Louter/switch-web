import styled from 'styled-components';

export const CalendarWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .fc {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  /* 헤더 레이아웃 재구성 */
  .fc-header-toolbar.fc-toolbar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    flex-shrink: 0;
    margin: 0px;
  }

  .fc-header-toolbar .fc-toolbar-chunk {
    display: flex;
    align-items: center;
  }

  .fc-header-toolbar .fc-toolbar-chunk:first-child,
  .fc-header-toolbar .fc-toolbar-chunk:last-child {
    flex-grow: 0;
  }

  .fc-header-toolbar .fc-toolbar-chunk:nth-child(2) {
    flex-grow: 0;
    display: flex;
    align-items: center;
  }

  /* prev 버튼과 title 사이 간격 */
  .fc-header-toolbar .fc-prev-button {
    margin-right: 15px;
  }

  /* title과 next 버튼 사이 간격 */
  .fc-header-toolbar .fc-next-button {
    margin-left: 15px;
  }

  .fc-header-toolbar .fc-toolbar-title {
    font-size: 1.3em;
    font-weight: 500;
    color: #333;
    margin: 0;
    padding: 0;
  }

  .fc .fc-button {
    background: none;
    border: none;
    color: #666;
    font-size: 1.2em;
    padding: 0.4em 0.5em;
    box-shadow: none;
    text-shadow: none;
  }

  .fc .fc-button:hover {
    background: none;
    color: #333;
  }

  .fc .fc-button:focus {
    box-shadow: none;
  }

  .fc .fc-button-active {
    background: none;
  }

  /* 뷰 컨테이너 */
  .fc-view-harness {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 요일 헤더 */
  .fc .fc-col-header-cell {
    padding: 10px 0;
    font-weight: 400;
    font-size: 0.9em;
    color: #666;
    background: white;
    border: none;
    width: 14.28%;
    text-align: left;
    padding-left: 10px;
  }

  .fc .fc-col-header-cell-cushion {
    text-align: left;
  }

  /* 일요일 빨간색 */
  .fc .fc-day-sun .fc-col-header-cell-cushion {
    color: #ff6b6b;
  }

  /* 토요일 파란색 */
  .fc .fc-day-sat .fc-col-header-cell-cushion {
    color: #4dabf7;
  }

  /* 그리드 전체를 감싸는 테두리와 여백 */
  .fc .fc-scrollgrid {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    height: 90%;
  }

  .fc .fc-scrollgrid-section-body > td {
    border: none;
    height: 100%;
  }

  /* 날짜 셀 */
  .fc .fc-daygrid-day {
    background: white;
    border: 1px solid #e9ecef;
    width: 14.28%;
    height: 20%;
  }

  .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
    margin-bottom: 0px;
  }

  .fc .fc-daygrid-day-frame {
    height: 100%;
    position: relative;
  }

  .fc .fc-daygrid-day-top {
    justify-content: flex-start;
    padding: 5px;
  }

  .fc .fc-daygrid-day-number {
    padding: 8px;
    font-size: 0.9em;
    color: #333;
    font-weight: 400;
    text-align: left;
    position: absolute;
    top: 0;
    left: 0;
  }

  /* 일요일 날짜 빨간색 */
  .fc .fc-day-sun .fc-daygrid-day-number {
    color: #ff6b6b;
  }

  /* 토요일 날짜 파란색 */
  .fc .fc-day-sat .fc-daygrid-day-number {
    color: #4dabf7;
  }

  /* 이전/다음 달 날짜 */
  .fc .fc-day-other .fc-daygrid-day-number {
    color: #adb5bd;
  }

  /* 이벤트 영역 */
  .fc .fc-daygrid-day-events {
    margin-top: 20px;
  }

  /* 이벤트 스타일 */
  .fc .fc-event {
    background-color: #ffd43b;
    border: none;
    border-radius: 4px;
    padding: 2px 6px;
    margin: 2px 4px;
    font-size: 0.85em;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .fc .fc-event:hover {
    background-color: #fcc419;
  }

  .fc .fc-event-main {
    color: #333;
  }

  /* 이벤트 아이콘 */
  .fc .fc-event-title:before {
    content: '📁 ';
  }

  /* 오늘 날짜 하이라이트 */
  .fc .fc-day-today {
    background-color: rgba(66, 153, 225, 0.05);
  }

  /* 6번째 행 숨기기 (5개 행으로 고정) */
  .fc .fc-daygrid-body tr:nth-child(6) {
    display: none;
  }

  /* 5개 행 높이 균등 분배 */
  .fc .fc-daygrid-body tr {
    height: 20%;
  }
`;