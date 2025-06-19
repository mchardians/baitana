"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'align': [] }],
    // ['link', 'image', 'video'],
    ['clean']
];

function QuillEditorManual({ value, onChange, readOnly = false, placeholder = '' }) {
    const editorContainerRef = useRef(null);
    const quillInstanceRef = useRef(null);
    const initialValueSetRef = useRef(false);
    const textChangeHandlerRef = useRef(null);

    const debouncedOnChange = useCallback(() => {
        if (quillInstanceRef.current && onChange) {
            const html = quillInstanceRef.current.root.innerHTML;
            const cleanHtml = html === '<p><br></p>' || html === '<p><br/></p>' ? '' : html;
            onChange(cleanHtml);
        }
    }, [onChange]);

    useEffect(() => {
        if (!editorContainerRef.current) return;

        if (!quillInstanceRef.current) {
            console.log("INITIALIZING QUILL INSTANCE");

            const originalConsoleWarn = console.warn;
            console.warn = (...args) => {
                if (args[0]?.includes && args[0].includes('DOMNodeInserted')) {
                    return;
                }
                originalConsoleWarn.apply(console, args);
            };

            quillInstanceRef.current = new Quill(editorContainerRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: TOOLBAR_OPTIONS,
                },
                formats: [
                    'header', 'font', 'list', 'bold', 'italic', 'underline', 'strike',
                    'color', 'background', 'script', 'align', 'clean'
                ],
                placeholder: placeholder,
                readOnly: readOnly,
            });

            console.warn = originalConsoleWarn;

            if (value !== null && value !== undefined && value.trim() !== '') {
                const delta = quillInstanceRef.current.clipboard.convert(value);
                quillInstanceRef.current.setContents(delta);
            } else {
                quillInstanceRef.current.setText('');
            }

            initialValueSetRef.current = true;

            textChangeHandlerRef.current = (delta, oldDelta, source) => {
                if (source === 'user') {
                    // Cek apakah ada newline yang diinsert atau perubahan lain
                    const newlineInserted = delta.ops?.some(op => typeof op.insert === 'string' && op.insert.includes('\n'));

                    if (newlineInserted) {
                        // Gunakan setTimeout untuk memastikan Quill selesai memproses newline
                        setTimeout(() => {
                            const selection = quillInstanceRef.current.getSelection();
                            if (selection) {
                                quillInstanceRef.current.formatText(selection.index, 0, 'background', false);
                                quillInstanceRef.current.formatText(selection.index, 0, 'color', false);
                                quillInstanceRef.current.formatText(selection.index, 0, 'bold', false);
                                quillInstanceRef.current.formatText(selection.index, 0, 'italic', false);
                                quillInstanceRef.current.formatText(selection.index, 0, 'underline', false);
                                quillInstanceRef.current.formatText(selection.index, 0, 'strike', false); // Tambah strike
                                quillInstanceRef.current.formatText(selection.index, 0, 'header', false); // Tambah header
                            }
                            // Panggil debouncedOnChange HANYA SETELAH SEMUA MANIPULASI DOM SELESAI
                            debouncedOnChange();
                        }, 0);
                    } else {
                        // Untuk perubahan teks selain Enter, panggil debouncedOnChange langsung
                        debouncedOnChange();
                    }
                }
            };

            quillInstanceRef.current.on('text-change', textChangeHandlerRef.current);

            const toolbar = quillInstanceRef.current.getModule('toolbar');
            if (toolbar) {
                toolbar.addHandler('clean', () => {
                    const quill = quillInstanceRef.current;
                    if (quill) {
                        quill.setText('');
                        debouncedOnChange();
                        quill.focus();
                    }
                });
            }
        }

        return () => {
            console.log("CLEANUP EFFECT - Removing Quill instance.");
            if (quillInstanceRef.current) {
                if (textChangeHandlerRef.current) {
                    quillInstanceRef.current.off('text-change', textChangeHandlerRef.current);
                }
                quillInstanceRef.current = null;
            }
            textChangeHandlerRef.current = null;

            if (editorContainerRef.current) {
                while (editorContainerRef.current.firstChild) {
                    editorContainerRef.current.removeChild(editorContainerRef.current.firstChild);
                }
            }
            initialValueSetRef.current = false;
        };
    }, [debouncedOnChange]);

    useEffect(() => {
        if (quillInstanceRef.current && initialValueSetRef.current) {
            const editor = quillInstanceRef.current;
            const currentQuillHtml = editor.root.innerHTML;

            const normalizedValue = value === null || value === undefined || value.trim() === '' ? '' : value.trim();
            const normalizedCurrentQuillHtml = currentQuillHtml === '<p><br></p>' || currentQuillHtml === '<p><br/></p>' ? '' : currentQuillHtml.trim();

            if (normalizedValue !== normalizedCurrentQuillHtml) {
                console.log("Updating Quill content from value prop.");
                if (normalizedValue === '') {
                    editor.setText('');
                } else {
                    const delta = quillInstanceRef.current.clipboard.convert(normalizedValue);
                    editor.setContents(delta);
                }
            }
        }
    }, [value]);

    useEffect(() => {
        if (quillInstanceRef.current) {
            quillInstanceRef.current.enable(!readOnly);
        }
    }, [readOnly]);

    return (
        <div className="flex flex-col flex-grow h-[300px] min-h-[300px]">
            <div ref={editorContainerRef} className="quill-editor-container" />
        </div>
    );
}

export default QuillEditorManual;