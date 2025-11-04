import { useDroppable } from '@dnd-kit/core';
import { TableCell, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';

import { DayCellProps } from '@/components/Calendar/types';

const DayCell = ({ day, dateString, holiday, onClick, children }: DayCellProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: dateString || '',
    data: { dateString },
  });

  return (
    <TableCell
      ref={setNodeRef}
      sx={{
        height: '120px',
        verticalAlign: 'top',
        width: '14.28%',
        padding: 1,
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        position: 'relative',
        background: isOver ? blue[100] : undefined,
      }}
      onClick={onClick}
    >
      {day && (
        <>
          <Typography variant="body2" fontWeight="bold">
            {day}
          </Typography>
          {holiday && (
            <Typography variant="body2" color="error">
              {holiday}
            </Typography>
          )}
          {children}
        </>
      )}
    </TableCell>
  );
};

export default DayCell;
