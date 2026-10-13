import React, { useState } from 'react';
import { Hall, Seat, AllocationEnriched } from '../types/database';
import { 
  Printer, 
  User, 
  CheckCircle, 
  XCircle, 
  Layers, 
  MapPin, 
  Info,
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';

interface SeatingGridVisualizerProps {
  halls: Hall[];
  seats: Seat[];
  allocations: AllocationEnriched[];
  selectedHallId?: number;
  highlightedStudentRollNo?: string;
  onSelectHall?: (hallId: number) => void;
  isReadOnly?: boolean;
}

export const SeatingGridVisualizer: React.FC<SeatingGridVisualizerProps> = ({
  halls,
  seats,
  allocations,
  selectedHallId,
  highlightedStudentRollNo,
  onSelectHall,
}) => {
  const [activeHallId, setActiveHallId] = useState<number>(
    selectedHallId || (halls[0]?.hall_id || 1)
  );
  const [selectedSeatDetails, setSelectedSeatDetails] = useState<AllocationEnriched | null>(null);

  const currentHall = halls.find(h => h.hall_id === (selectedHallId || activeHallId)) || halls[0];
  const hallSeats = seats.filter(s => s.hall_id === currentHall?.hall_id);
  const hallAllocations = allocations.filter(a => a.hall_id === currentHall?.hall_id);

  const occupiedSeatsCount = hallSeats.filter(s => s.status === 'Occupied').length;
  const availableSeatsCount = hallSeats.length - occupiedSeatsCount;
  const occupancyPct = hallSeats.length > 0 ? Math.round((occupiedSeatsCount / hallSeats.length) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  if (!currentHall) {
    return <div className="p-8 text-center text-slate-500">No halls configured.</div>;
  }

  // Create grid structure: Rows x Cols
  const rows = currentHall.rows || 6;
  const cols = currentHall.columns || 10;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h3 className="text-lg font-bold text-slate-900">
              Interactive Seating Layout: {currentHall.hall_number}
            </h3>
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
              {currentHall.building} • Floor {currentHall.floor}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visual desk grid layout showing real-time seat occupancy and candidate assignments.
          </p>
        </div>

        {/* Hall selection and print */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Select Hall:</span>
          </label>
          <select
            value={currentHall.hall_id}
            onChange={(e) => {
              const val = Number(e.target.value);
              setActiveHallId(val);
              if (onSelectHall) onSelectHall(val);
            }}
            className="text-sm bg-white border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {halls.map(h => (
              <option key={h.hall_id} value={h.hall_id}>
                {h.hall_number} ({h.building} - Capacity: {h.capacity})
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-sm transition"
            title="Print Hall Door Seating Chart"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Door Chart</span>
          </button>
        </div>
      </div>

      {/* Capacity & Legend Banner */}
      <div className="px-6 py-3 bg-blue-50/50 border-b border-blue-100/60 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <span>Capacity:</span>
            <span className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
              {currentHall.capacity} Desks
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-blue-700">
            <span>Occupied:</span>
            <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
              {occupiedSeatsCount} ({occupancyPct}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
            <span>Available:</span>
            <span className="font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              {availableSeatsCount}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 inline-block shadow-sm"></span>
            <span>Vacant / Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-600 border border-blue-700 inline-block shadow-sm"></span>
            <span>Allocated / Seated</span>
          </div>
          {highlightedStudentRollNo && (
            <div className="flex items-center gap-1.5 text-indigo-700 font-bold animate-pulse">
              <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500 inline-block shadow-md"></span>
              <span>YOUR SEAT</span>
            </div>
          )}
        </div>
      </div>

      {/* Blackboard / Invigilator Front Stage */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-slate-200 text-xs font-semibold py-2 px-6 rounded-lg shadow-inner tracking-widest uppercase border border-slate-600 flex items-center justify-center gap-2">
            <span>BOARD / INVIGILATOR&apos;S PODIUM (FRONT OF HALL)</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
            Entrance Door 🚪 (Left Wing) &nbsp; • &nbsp; Exit Door (Right Wing)
          </div>
        </div>

        {/* Seating Grid Map */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[650px] mx-auto flex flex-col gap-3 items-center">
            {Array.from({ length: rows }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              return (
                <div key={`row-${rowNum}`} className="flex items-center gap-3">
                  {/* Row indicator */}
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center border border-slate-200 shadow-inner">
                    R{rowNum}
                  </div>

                  {/* Columns */}
                  <div className="flex items-center gap-2.5">
                    {Array.from({ length: cols }).map((_, cIdx) => {
                      const colNum = cIdx + 1;
                      const seat = hallSeats.find(
                        s => s.row_number === rowNum && s.column_number === colNum
                      );
                      const allocation = seat
                        ? hallAllocations.find(a => a.seat_id === seat.seat_id)
                        : undefined;

                      const isHighlighted =
                        highlightedStudentRollNo &&
                        allocation &&
                        allocation.roll_no.toLowerCase() === highlightedStudentRollNo.toLowerCase();

                      if (!seat) {
                        return (
                          <div
                            key={`empty-${rowNum}-${colNum}`}
                            className="w-12 h-12 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-[10px] text-slate-300"
                          >
                            -
                          </div>
                        );
                      }

                      const isOccupied = seat.status === 'Occupied' || !!allocation;

                      return (
                        <button
                          key={seat.seat_id}
                          onClick={() => {
                            if (allocation) setSelectedSeatDetails(allocation);
                          }}
                          className={`group relative w-12 h-12 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center transition-all transform hover:scale-105 shadow-sm ${
                            isHighlighted
                              ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-300/80 shadow-lg animate-bounce z-20'
                              : isOccupied
                              ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                          title={`Seat: ${seat.seat_number} (Row ${rowNum}, Col ${colNum})${
                            allocation ? ` - Allocated to: ${allocation.student_name} (${allocation.roll_no})` : ' - Vacant'
                          }`}
                        >
                          <span className="text-[10px] font-mono leading-none">
                            {colNum}
                          </span>
                          <span className="text-[9px] opacity-75 font-normal leading-tight mt-0.5">
                            {isOccupied ? (allocation?.roll_no ? allocation.roll_no.slice(-3) : 'OCC') : 'VAC'}
                          </span>

                          {/* Hover Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                            <div className="bg-slate-900 text-white text-[11px] font-normal px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap border border-slate-700">
                              <p className="font-bold text-amber-300">{seat.seat_number}</p>
                              {allocation ? (
                                <>
                                  <p className="text-white">{allocation.student_name}</p>
                                  <p className="text-blue-300 font-mono text-[10px]">{allocation.roll_no} • {allocation.branch}</p>
                                  <p className="text-slate-300 text-[9px]">{allocation.subject_name}</p>
                                </>
                              ) : (
                                <p className="text-emerald-400 font-semibold">Seat Vacant &amp; Available</p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Row indicator right */}
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 text-xs font-mono flex items-center justify-center">
                    R{rowNum}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Seat Details Popup */}
        {selectedSeatDetails && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {selectedSeatDetails.student_name}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-blue-200 text-blue-900 font-bold">
                    {selectedSeatDetails.roll_no}
                  </span>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                    {selectedSeatDetails.branch} - Year {selectedSeatDetails.year} (Sec {selectedSeatDetails.section})
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Seat Number</span>
                    <span className="font-bold text-blue-800 font-mono">{selectedSeatDetails.seat_number} (R{selectedSeatDetails.row_number}-C{selectedSeatDetails.column_number})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Subject</span>
                    <span className="font-semibold text-slate-800">{selectedSeatDetails.subject_code} - {selectedSeatDetails.subject_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Exam Date &amp; Time</span>
                    <span className="font-medium text-slate-800">{selectedSeatDetails.exam_date} ({selectedSeatDetails.start_time} - {selectedSeatDetails.end_time})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Allocated On</span>
                    <span className="font-mono text-slate-700">{selectedSeatDetails.allocation_date}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedSeatDetails(null)}
              className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1 rounded bg-white border border-slate-200"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
