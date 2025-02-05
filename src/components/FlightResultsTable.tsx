import { Badge } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { visuallyHidden } from '@mui/utils';
import dayjs from 'dayjs';
import { MdFlightLand, MdFlightTakeoff } from 'react-icons/md';
import type { FlightResult, Itinerary, Leg } from '../types';
import { formatFlightTags } from '../utils/FormatFlightTags';
import React from 'react';

function descendingComparator<T extends { price: { raw: number }; legs: Leg[] }>(
  a: T,
  b: T,
  orderBy: keyof T,
) {
  if (orderBy === 'arrival' || orderBy === 'departure') {
    const dateA =
      orderBy === 'arrival' ? dayjs(a.legs[0].arrival) : dayjs(a.legs[0].departure);
    const dateB =
      orderBy === 'arrival' ? dayjs(b.legs[0].arrival) : dayjs(b.legs[0].departure);
    if (dateA && dateB) {
      if (dateA.isBefore(dateB)) {
        return 1;
      }
      if (dateA.isAfter(dateB)) {
        return -1;
      }
    }
  } else if (orderBy === 'price') {
    return b.price.raw - a.price.raw;
  } else if (orderBy === 'duration') {
    return b.legs[0].durationInMinutes - a.legs[0].durationInMinutes;
  } else if (orderBy === 'flight') {
    const carrierA = a.legs[0].carriers.marketing[0].name;
    const carrierB = b.legs[0].carriers.marketing[0].name;
    if (carrierA < carrierB) {
      return 1;
    }
    if (carrierA > carrierB) {
      return -1;
    }
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator(
  order: Order,
  orderBy: keyof Itinerary,
): (a: Itinerary, b: Itinerary) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'flight',
    numeric: false,
    disablePadding: true,
    label: 'Flight',
  },
  {
    id: 'departure',
    numeric: false,
    disablePadding: false,
    label: 'Departure',
  },
  {
    id: 'arrival',
    numeric: false,
    disablePadding: false,
    label: 'Arrival',
  },
  {
    id: 'duration',
    numeric: false,
    disablePadding: false,
    label: 'Duration',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Itinerary) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Itinerary) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all flights',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id as keyof Itinerary)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Flights
        </Typography>
      )}
    </Toolbar>
  );
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

/**
 * FlightResultsTable is a React component that takes a FlightResult object as a prop and displays its contents in a table.
 *
 * The table displays the following columns:
 * - Flight: The airline name, logo, and any flight tags (e.g. "Best", "Cheapest", etc.)
 * - Departure: The departure date and time
 * - Arrival: The arrival date and time
 * - Duration: The duration of the flight in hours and minutes
 * - Price: The price of the flight in the user's selected currency
 *
 * The component is designed to be used in conjunction with the SearchFlightOptions component.
 */
export const FlightResultsTable = ({ result }: { result: FlightResult }) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Itinerary>('price');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Itinerary,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = result.itineraries.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - result.itineraries.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...result.itineraries]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, result.itineraries, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer component={Paper} elevation={3} sx={{ maxHeight: 440 }}>
          <Table
            stickyHeader
            aria-label="sticky table"
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            sx={{ minWidth: 750 }}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={result.itineraries.length}
            />
            <TableBody>
              {visibleRows.map((flight, index) => {
                const firstLeg = flight.legs[0];
                const carrier = firstLeg.carriers.marketing[0];
                const isItemSelected = selected.includes(flight.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, flight.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={flight.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <Box
                        component="img"
                        src={carrier.logoUrl}
                        alt={carrier.name}
                        sx={{ borderRadius: '50%', maxWidth: 24 }}
                      />
                      <Typography variant="body2">{carrier.name}</Typography>
                      {flight.tags && flight.tags?.length > 0 && (
                        <Tooltip
                          title={formatFlightTags(flight.tags)}
                          sx={{ textTransform: '' }}
                        >
                          <Badge variant="dot" color="primary" />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        justifyContent="center"
                      >
                        <MdFlightTakeoff size={18} color="gray" />
                        {dayjs(firstLeg.departure).format('MMM DD, h:mm A')}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        justifyContent="center"
                      >
                        <MdFlightLand size={18} color="gray" />
                        {dayjs(firstLeg.arrival).format('MMM DD, h:mm A')}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {Math.floor(firstLeg.durationInMinutes / 60)}h{' '}
                      {firstLeg.durationInMinutes % 60}m
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" fontWeight="bold">
                        {flight.price.formatted}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
          colSpan={3}
          component="div"
          count={result.itineraries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          slotProps={{
            select: {
              inputProps: {
                'aria-label': 'rows per page',
              },
              native: true,
            },
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </Paper>
    </Box>
  );
};
