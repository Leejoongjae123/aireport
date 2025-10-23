"use client";

import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FlatSubsectionItem } from "../types";

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

const Toggle = ({ checked, onCheckedChange, className }: ToggleProps) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onCheckedChange(!checked);
      }}
      className={cn(
        "relative inline-flex h-[18px] w-8 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        checked ? "bg-[#07F]" : "bg-neutral-400",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-3.5 w-3.5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5"
        )}
      />
    </button>
  );
};

interface SortableItemProps {
  item: FlatSubsectionItem;
  isSelected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}

function SortableItem({
  item,
  isSelected,
  onSelect,
  onToggle,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between rounded-md p-3 cursor-pointer hover:bg-gray-50",
        isSelected ? "bg-[#E8F3FF]" : "border border-[#D9D9D9] bg-white",
        isDragging && "opacity-50"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-6 w-6 text-[#303030]" />
        </div>
        <span
          className={cn(
            "text-base font-medium leading-[29px]",
            item.enabled ? "text-[#303030]" : "text-[#B3B3B3]"
          )}
        >
          {item.name}
        </span>
      </div>
      <Toggle checked={item.enabled} onCheckedChange={onToggle} />
    </div>
  );
}

interface TableOfContentsListProps {
  flatSubsections: FlatSubsectionItem[];
  selectedSubsectionId: string | null;
  onSelectSubsection: (id: string) => void;
  onToggleSubsection: (id: string) => void;
  onReorder: (items: FlatSubsectionItem[]) => void;
}

export function TableOfContentsList({
  flatSubsections,
  selectedSubsectionId,
  onSelectSubsection,
  onToggleSubsection,
  onReorder,
}: TableOfContentsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = flatSubsections.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = flatSubsections.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(flatSubsections, oldIndex, newIndex);
      onReorder(newItems);
    }
  };

  return (
    <div className="flex h-[709px] flex-1 flex-col gap-2.5 rounded-xl border border-[#EEF1F7] bg-white p-6 shadow-[0_0_10px_0_rgba(60,123,194,0.12)] overflow-y-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold leading-8 tracking-[-0.4px] text-[#303030]">
            현재 목차 구성
          </h2>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={flatSubsections.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2.5">
              {flatSubsections.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  isSelected={selectedSubsectionId === item.id}
                  onSelect={() => onSelectSubsection(item.id)}
                  onToggle={() => onToggleSubsection(item.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
