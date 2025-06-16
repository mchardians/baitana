"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export function MultiSelect({ options, selected, onSelectedChange, placeholder, disabled = false }) {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");

    const handleSelect = (currentValue) => {
        const isSelected = selected.includes(currentValue);
        let newSelected;

        if (isSelected) {
            newSelected = selected.filter((item) => item !== currentValue);
        } else {
            newSelected = [...selected, currentValue];
        }
        onSelectedChange(newSelected);
    };

    const handleRemove = (valueToRemove, e) => {
        e.preventDefault();
        e.stopPropagation();
        const newSelected = selected.filter((item) => item !== valueToRemove);
        onSelectedChange(newSelected);
    };

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-between h-auto min-h-10 px-2",
                        disabled && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={disabled}
                >
                    <div className="flex items-start w-full min-w-0">
                        <div className="flex flex-wrap gap-1 flex-1 min-w-0 max-w-full">
                            {selected.length === 0 ? (
                                <span className="text-muted-foreground whitespace-nowrap">{placeholder || "Pilih..."}</span>
                            ) : (
                                selected.map((valueId) => {
                                    const option = options.find((opt) => opt.value === valueId);
                                    return (
                                        <Badge
                                            key={valueId}
                                            className={cn(
                                                "flex items-center gap-1 whitespace-nowrap",
                                                "bg-blue-100 text-blue-800 hover:bg-blue-200",
                                                "dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                                            )}
                                        >
                                            {option ? option.label : `ID: ${valueId}`}
                                            <span
                                                className="ml-1 h-3 w-3 cursor-pointer rounded-full hover:bg-blue-300 dark:hover:bg-blue-700 flex items-center justify-center"
                                                onClick={(e) => handleRemove(valueId, e)}
                                                aria-label={`Remove ${option?.label || valueId}`}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleRemove(valueId, e);
                                                    }
                                                }}
                                            >
                                                <X className="h-2 w-2" />
                                            </span>
                                        </Badge>
                                    );
                                })
                            )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 mt-1" />
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <div className="flex flex-col">
                    {/* Search Input */}
                    <div className="p-2 border-b">
                        <Input
                            placeholder="Cari..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="h-8"
                        />
                    </div>

                    {/* Scrollable Options */}
                    <div
                        className="p-1"
                        style={{
                            maxHeight: '240px',
                            overflowY: 'scroll',
                            overflowX: 'hidden',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#9ca3af #f3f4f6',
                            WebkitOverflowScrolling: 'touch',
                            // Force scrollable behavior
                            minHeight: '100px'
                        }}
                        onWheel={(e) => {
                            // Force wheel event to work
                            e.currentTarget.scrollTop += e.deltaY;
                        }}
                        onTouchStart={(e) => {
                            // Store initial touch position
                            if (e.target.closest('.cursor-pointer')) return;
                            e.currentTarget.dataset.touchStartY = e.touches[0].clientY;
                        }}
                        onTouchMove={(e) => {
                            // Handle touch scroll manually
                            if (e.target.closest('.cursor-pointer')) return;
                            const startY = parseFloat(e.currentTarget.dataset.touchStartY || '0');
                            const currentY = e.touches[0].clientY;
                            const diff = startY - currentY;
                            e.currentTarget.scrollTop += diff;
                            e.currentTarget.dataset.touchStartY = currentY;
                        }}
                    >
                        {filteredOptions.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Tidak ditemukan.
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "flex items-center px-2 py-1.5 text-sm cursor-pointer rounded-sm",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        selected.includes(option.value) &&
                                        "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                                    )}
                                    onClick={() => handleSelect(option.value)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selected.includes(option.value)
                                                ? "opacity-100 text-blue-800 dark:text-blue-200"
                                                : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}