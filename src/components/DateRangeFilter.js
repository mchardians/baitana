"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export function DateRangeFilter({ onApplyFilter }) {
    const { handleSubmit, control, watch, setValue } = useForm({
        defaultValues: {
            startDate: undefined,
            endDate: undefined,
        },
    });

    const startDate = watch("startDate");
    const endDate = watch("endDate");

    const isClearingFilter = useRef(false);

    const debouncedStartDate = useDebounce(startDate, 500);
    const debouncedEndDate = useDebounce(endDate, 500);

    // --- Logika Auto-Submit yang Diperbarui ---
    useEffect(() => {
        if (isClearingFilter.current) {
            isClearingFilter.current = false;
            return;
        }

    }, [debouncedStartDate, debouncedEndDate, onApplyFilter]);

    // --- Logika Manual Submit ---
    const onSubmit = (data) => {
        const formattedStartDate = data.startDate
            ? format(data.startDate, "dd-MM-yyyy")
            : null;
        const formattedEndDate = data.endDate
            ? format(data.endDate, "dd-MM-yyyy")
            : null;

        // Validasi untuk manual submit
        if (data.startDate && data.endDate && data.startDate > data.endDate) {
            alert("Tanggal mulai tidak boleh setelah tanggal selesai.");
            return;
        }
        onApplyFilter({ startDate: formattedStartDate, endDate: formattedEndDate });
    };

    // --- Logika Clear Filter ---
    const handleClearFilter = () => {
        isClearingFilter.current = true;
        setValue("startDate", undefined);
        setValue("endDate", undefined);
        onApplyFilter({ startDate: null, endDate: null });
    };

    // Helper function untuk convert date ke format input
    const dateToInputValue = (date) => {
        if (!date) return "";
        return format(date, "yyyy-MM-dd");
    };

    // Helper function untuk convert input value ke date
    const inputValueToDate = (value) => {
        if (!value) return undefined;
        return new Date(value);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
                padding: '24px',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                marginBottom: '16px'
            }}
        >
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#1a202c'
            }}>
                Filter by Date Range
            </h3>

            <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '16px'
            }}>
                {/* Start Date */}
                <div style={{ width: '50%' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px',
                        color: '#374151'
                    }}>
                        Tanggal Mulai
                    </label>
                    <Controller
                        control={control}
                        name="startDate"
                        render={({ field }) => (
                            <input
                                type="date"
                                value={dateToInputValue(field.value)}
                                onChange={(e) => field.onChange(inputValueToDate(e.target.value))}
                                max={endDate ? dateToInputValue(endDate) : undefined}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    backgroundColor: '#ffffff',
                                    color: '#374151',
                                    height: '40px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        )}
                    />
                </div>

                {/* End Date */}
                <div style={{ width: '50%' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        marginBottom: '8px',
                        color: '#374151'
                    }}>
                        Tanggal Selesai
                    </label>
                    <Controller
                        control={control}
                        name="endDate"
                        render={({ field }) => (
                            <input
                                type="date"
                                value={dateToInputValue(field.value)}
                                onChange={(e) => field.onChange(inputValueToDate(e.target.value))}
                                min={startDate ? dateToInputValue(startDate) : undefined}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    backgroundColor: '#ffffff',
                                    color: '#374151',
                                    height: '40px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        )}
                    />
                </div>
            </div>

            <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap'
            }}>
                <button
                    type="button"
                    onClick={handleClearFilter}
                    style={{
                        padding: '8px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#ffffff';
                    }}
                >
                    Clear Filter
                </button>
                <button
                    type="submit"
                    style={{
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: '#2C3E9E',
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#243280';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#2C3E9E';
                    }}
                >
                    Apply Filter
                </button>
            </div>
        </form>
    );
}