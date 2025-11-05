import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { EventFormProps } from '@/components/Form/types';
import { categories, notificationOptions } from '@/constants.ts';
import { RepeatType } from '@/types.ts';
import { getTimeErrorMessage } from '@/utils/timeValidation.ts';

const EventForm = ({ data, setData, errors, editingEvent, addOrUpdateEvent }: EventFormProps) => {
  return (
    <Stack spacing={2} sx={{ width: '20%' }}>
      <Typography variant="h4">{editingEvent ? '일정 수정' : '일정 추가'}</Typography>

      <FormControl fullWidth>
        <FormLabel htmlFor="title">제목</FormLabel>
        <TextField
          id="title"
          size="small"
          value={data.title}
          onChange={(e) => setData.title(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="date">날짜</FormLabel>
        <TextField
          id="date"
          size="small"
          type="date"
          value={data.date}
          onChange={(e) => setData.date(e.target.value)}
        />
      </FormControl>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="start-time">시작 시간</FormLabel>
          <Tooltip title={errors.startTime || ''} open={!!errors.startTime} placement="top">
            <TextField
              id="start-time"
              size="small"
              type="time"
              value={data.startTime}
              onChange={setData.startTime}
              onBlur={() => getTimeErrorMessage(data.startTime, data.endTime)}
              error={!!errors.startTime}
            />
          </Tooltip>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="end-time">종료 시간</FormLabel>
          <Tooltip title={errors.endTime || ''} open={!!errors.endTime} placement="top">
            <TextField
              id="end-time"
              size="small"
              type="time"
              value={data.endTime}
              onChange={setData.endTime}
              onBlur={() => getTimeErrorMessage(data.startTime, data.endTime)}
              error={!!errors.endTime}
            />
          </Tooltip>
        </FormControl>
      </Stack>

      <FormControl fullWidth>
        <FormLabel htmlFor="description">설명</FormLabel>
        <TextField
          id="description"
          size="small"
          value={data.description}
          onChange={(e) => setData.description(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="location">위치</FormLabel>
        <TextField
          id="location"
          size="small"
          value={data.location}
          onChange={(e) => setData.location(e.target.value)}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel id="category-label">카테고리</FormLabel>
        <Select
          id="category"
          size="small"
          value={data.category}
          onChange={(e) => setData.category(e.target.value)}
          aria-labelledby="category-label"
          aria-label="카테고리"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat} aria-label={`${cat}-option`}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {!editingEvent && (
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={data.isRepeating}
                onChange={(e) => {
                  const checked = e.target.checked;
                  const type = checked ? 'daily' : 'none';

                  setData.isRepeating(checked);
                  setData.repeat.type(type);
                }}
              />
            }
            label="반복 일정"
          />
        </FormControl>
      )}

      {/* ! TEST CASE */}
      {data.isRepeating && !editingEvent && (
        <Stack spacing={2}>
          <FormControl fullWidth>
            <FormLabel>반복 유형</FormLabel>
            <Select
              size="small"
              value={data.repeat.type}
              aria-label="반복 유형"
              onChange={(e) => setData.repeat.type(e.target.value as RepeatType)}
            >
              <MenuItem value="daily" aria-label="daily-option">
                매일
              </MenuItem>
              <MenuItem value="weekly" aria-label="weekly-option">
                매주
              </MenuItem>
              <MenuItem value="monthly" aria-label="monthly-option">
                매월
              </MenuItem>
              <MenuItem value="yearly" aria-label="yearly-option">
                매년
              </MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel htmlFor="repeat-interval">반복 간격</FormLabel>
              <TextField
                id="repeat-interval"
                size="small"
                type="number"
                value={data.repeat.interval}
                onChange={(e) => setData.repeat.interval(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="repeat-end-date">반복 종료일</FormLabel>
              <TextField
                id="repeat-end-date"
                size="small"
                type="date"
                value={data.repeat.endDate}
                onChange={(e) => setData.repeat.endDate(e.target.value)}
              />
            </FormControl>
          </Stack>
        </Stack>
      )}

      <FormControl fullWidth>
        <FormLabel htmlFor="notification">알림 설정</FormLabel>
        <Select
          id="notification"
          size="small"
          value={data.notificationTime}
          onChange={(e) => setData.notificationTime(Number(e.target.value))}
        >
          {notificationOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        data-testid="event-submit-button"
        onClick={addOrUpdateEvent}
        variant="contained"
        color="primary"
      >
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </Stack>
  );
};

export default EventForm;
