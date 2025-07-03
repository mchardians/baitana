"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Definisi opsi toolbar Quill
const TOOLBAR_OPTIONS = [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'align': [] }],
    ['link', 'image', 'video'],
    ['clean']
];

function QuillEditorManual({ value, onChange, readOnly = false, placeholder = '' }) {
    const editorContainerRef = useRef(null);
    const quillInstanceRef = useRef(null);

    // Flag untuk memastikan inisialisasi konten awal hanya berjalan sekali,
    const initialValueSetRef = useRef(false);

    const debouncedOnChange = useCallback(() => {
        if (quillInstanceRef.current && onChange) {
            const html = quillInstanceRef.current.root.innerHTML;
            const cleanHtml = html === '<p><br></p>' || html === '<p><br/></p>' ? '' : html;
            onChange(cleanHtml);
        }
    }, [onChange]);

    // Efek pertama: Inisialisasi Quill dan atur event listener.
    // Berjalan hanya sekali saat komponen di-mount.
    useEffect(() => {
        if (!editorContainerRef.current) return;

        if (!quillInstanceRef.current) {
            console.log("INITIALIZING QUILL INSTANCE");
            quillInstanceRef.current = new Quill(editorContainerRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: TOOLBAR_OPTIONS,
                },
                placeholder: placeholder,
                readOnly: readOnly,
            });

            // Set nilai awal konten editor segera setelah inisialisasi.
            if (value !== null && value !== undefined && value.trim() !== '') {
                quillInstanceRef.current.clipboard.dangerouslyPasteHTML(0, value);
            } else {
                quillInstanceRef.current.setText('');
            }
            initialValueSetRef.current = true; // Set flag setelah konten awal diset

            quillInstanceRef.current.on('text-change', debouncedOnChange);
        }

        // Membersihkan instance Quill dan DOM untuk mencegah memory leak dan masalah re-render.
        return () => {
            console.log("CLEANUP EFFECT - Removing Quill instance.");
            if (quillInstanceRef.current) {
                quillInstanceRef.current.off('text-change', debouncedOnChange);
                quillInstanceRef.current = null;
            }

            if (editorContainerRef.current) {
                while (editorContainerRef.current.firstChild) {
                    editorContainerRef.current.removeChild(editorContainerRef.current.firstChild);
                }
            }
            initialValueSetRef.current = false; // Reset flag saat unmount
        };
    }, []);

    useEffect(() => {
        if (quillInstanceRef.current && initialValueSetRef.current) {
            const editor = quillInstanceRef.current;
            const currentQuillHtml = editor.root.innerHTML;

            if (value !== currentQuillHtml) {
                console.log("Updating Quill content from value prop.");
                if (value === null || value === undefined || value.trim() === '') {
                    if (currentQuillHtml !== '' && currentQuillHtml !== '<p><br></p>' && currentQuillHtml !== '<p><br/></p>') {
                        editor.setText('');
                    }
                } else {
                    editor.clipboard.dangerouslyPasteHTML(0, value);
                }
            }
        }
    }, [value]); // Dependensi: 'value' prop.

    useEffect(() => {
        if (quillInstanceRef.current) {
            quillInstanceRef.current.enable(!readOnly);
        }
    }, [readOnly]);

    return (
        <div className="flex flex-col flex-grow h-[300px] min-h-[300px]">
            {/* Div ini adalah target Quill untuk membangun editornya */}
            <div ref={editorContainerRef} className="quill-editor-container" />
        </div>
    );
}

export default QuillEditorManual;