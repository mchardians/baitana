// "use client";
//
// import React, { useRef, useEffect, useCallback } from 'react';
// import Quill from 'quill';
// import 'quill/dist/quill.snow.css';
//
// // Definisi opsi toolbar Quill
// const TOOLBAR_OPTIONS = [
//     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//     [{ 'font': [] }],
//     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//     ['bold', 'italic', 'underline', 'strike'],
//     [{ 'color': [] }, { 'background': [] }],
//     [{ 'script': 'sub'}, { 'script': 'super' }],
//     [{ 'align': [] }],
//     ['link', 'image', 'video'],
//     ['clean']
// ];
//
// function QuillEditorManual({ value, onChange, readOnly = false, placeholder = '' }) {
//     const editorContainerRef = useRef(null);
//     const quillInstanceRef = useRef(null);
//
//     // Flag untuk memastikan inisialisasi konten awal hanya berjalan sekali,
//     const initialValueSetRef = useRef(false);
//
//     const debouncedOnChange = useCallback(() => {
//         if (quillInstanceRef.current && onChange) {
//             const html = quillInstanceRef.current.root.innerHTML;
//             const cleanHtml = html === '<p><br></p>' || html === '<p><br/></p>' ? '' : html;
//             onChange(cleanHtml);
//         }
//     }, [onChange]);
//
//     // Efek pertama: Inisialisasi Quill dan atur event listener.
//     // Berjalan hanya sekali saat komponen di-mount.
//     useEffect(() => {
//         if (!editorContainerRef.current) return;
//
//         if (!quillInstanceRef.current) {
//             console.log("INITIALIZING QUILL INSTANCE");
//             quillInstanceRef.current = new Quill(editorContainerRef.current, {
//                 theme: 'snow',
//                 modules: {
//                     toolbar: TOOLBAR_OPTIONS,
//                 },
//                 placeholder: placeholder,
//                 readOnly: readOnly,
//             });
//
//             // Set nilai awal konten editor segera setelah inisialisasi.
//             if (value !== null && value !== undefined && value.trim() !== '') {
//                 quillInstanceRef.current.clipboard.dangerouslyPasteHTML(0, value);
//             } else {
//                 quillInstanceRef.current.setText('');
//             }
//             initialValueSetRef.current = true; // Set flag setelah konten awal diset
//
//             quillInstanceRef.current.on('text-change', debouncedOnChange);
//         }
//
//         // Membersihkan instance Quill dan DOM untuk mencegah memory leak dan masalah re-render.
//         return () => {
//             console.log("CLEANUP EFFECT - Removing Quill instance.");
//             if (quillInstanceRef.current) {
//                 quillInstanceRef.current.off('text-change', debouncedOnChange);
//                 quillInstanceRef.current = null;
//             }
//
//             if (editorContainerRef.current) {
//                 while (editorContainerRef.current.firstChild) {
//                     editorContainerRef.current.removeChild(editorContainerRef.current.firstChild);
//                 }
//             }
//             initialValueSetRef.current = false; // Reset flag saat unmount
//         };
//     }, []);
//
//     useEffect(() => {
//         if (quillInstanceRef.current && initialValueSetRef.current) {
//             const editor = quillInstanceRef.current;
//             const currentQuillHtml = editor.root.innerHTML;
//
//             if (value !== currentQuillHtml) {
//                 console.log("Updating Quill content from value prop.");
//                 if (value === null || value === undefined || value.trim() === '') {
//                     if (currentQuillHtml !== '' && currentQuillHtml !== '<p><br></p>' && currentQuillHtml !== '<p><br/></p>') {
//                         editor.setText('');
//                     }
//                 } else {
//                     editor.clipboard.dangerouslyPasteHTML(0, value);
//                 }
//             }
//         }
//     }, [value]); // Dependensi: 'value' prop.
//
//     useEffect(() => {
//         if (quillInstanceRef.current) {
//             quillInstanceRef.current.enable(!readOnly);
//         }
//     }, [readOnly]);
//
//     return (
//         <div className="flex flex-col flex-grow h-[300px] min-h-[300px]">
//             {/* Div ini adalah target Quill untuk membangun editornya */}
//             <div ref={editorContainerRef} className="quill-editor-container" />
//         </div>
//     );
// }
//
// export default QuillEditorManual;
//
// "use client";
//
// import React, { useRef, useEffect, useCallback } from 'react';
// // Pastikan Quill diimpor di sini, karena ini adalah 'use client' component.
// // Masalah SSR akan dihandle oleh dynamic import di komponen parent.
// import Quill from 'quill';
// import 'quill/dist/quill.snow.css';
//
// const TOOLBAR_OPTIONS = [
//     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//     [{ 'font': [] }],
//     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//     ['bold', 'italic', 'underline', 'strike'],
//     [{ 'color': [] }, { 'background': [] }],
//     [{ 'script': 'sub'}, { 'script': 'super' }],
//     [{ 'align': [] }],
//     ['link', 'image', 'video'],
//     ['clean']
// ];
//
// function QuillEditorManual({ value, onChange, readOnly = false, placeholder = '' }) {
//     const editorContainerRef = useRef(null);
//     const quillInstanceRef = useRef(null);
//
//     // Ref untuk menandakan apakah update berasal dari props atau dari user input
//     // Ini krusial untuk mencegah loop tak terbatas
//     const updatingFromProps = useRef(false);
//
//     // Debounced onChange handler untuk Quill content
//     const debouncedOnChange = useCallback(() => {
//         if (quillInstanceRef.current && onChange) {
//             // Hindari memanggil onChange jika update sedang dilakukan dari props
//             if (updatingFromProps.current) {
//                 return;
//             }
//
//             const html = quillInstanceRef.current.root.innerHTML;
//             const cleanHtml = (html === '<p><br></p>' || html === '<p><br/></p>') ? '' : html;
//
//             // Hanya panggil onChange jika konten benar-benar berubah dari nilai sebelumnya
//             // Ini mencegah re-render jika tidak ada perubahan signifikan
//             if (onChange && cleanHtml !== value) { // Bandingkan dengan value prop terakhir
//                 onChange(cleanHtml);
//             }
//         }
//     }, [onChange, value]); // 'onChange' dan 'value' adalah dependensi
//
//     // --- EFFECT 1: INITIALISASI QUILL ---
//     useEffect(() => {
//         const editorContainer = editorContainerRef.current;
//         if (!editorContainer) return;
//
//         // Pastikan Quill hanya diinisialisasi sekali dan hanya di client-side
//         if (typeof window !== 'undefined' && !quillInstanceRef.current) {
//             console.log("INITIALIZING QUILL INSTANCE");
//             const quill = new Quill(editorContainer, {
//                 theme: 'snow',
//                 modules: {
//                     toolbar: TOOLBAR_OPTIONS,
//                 },
//                 placeholder: placeholder,
//                 readOnly: readOnly,
//             });
//             quillInstanceRef.current = quill;
//
//             // Set nilai awal konten editor setelah inisialisasi
//             // Gunakan flag untuk mencegah `onChange` dipanggil saat inisialisasi awal
//             updatingFromProps.current = true;
//             if (value !== null && value !== undefined && value.trim() !== '') {
//                 quill.clipboard.dangerouslyPasteHTML(0, value);
//             } else {
//                 quill.setText('');
//             }
//             updatingFromProps.current = false; // Reset flag setelah set initial value
//
//             // Attach event listener
//             // `debouncedOnChange` adalah fungsi yang stabil berkat `useCallback`
//             quill.on('text-change', debouncedOnChange);
//         }
//
//         // Cleanup function for the effect
//         return () => {
//             console.log("CLEANUP EFFECT - Removing Quill instance.");
//             const quill = quillInstanceRef.current;
//             if (quill) {
//                 quill.off('text-change', debouncedOnChange);
//                 quillInstanceRef.current = null;
//             }
//
//             // Remove all child nodes from the container to prevent Quill re-attaching
//             if (editorContainer) {
//                 while (editorContainer.firstChild) {
//                     editorContainer.removeChild(editorContainer.firstChild);
//                 }
//             }
//         };
//     }, []); // Dependensi kosong: Efek ini hanya berjalan SEKALI saat mount
//
//     // --- EFFECT 2: UPDATE KONTEN DARI PROP 'VALUE' ---
//     useEffect(() => {
//         if (quillInstanceRef.current) {
//             const editor = quillInstanceRef.current;
//             const currentQuillHtml = editor.root.innerHTML;
//
//             // Normalize Quill's empty state for comparison
//             const normalizedCurrentQuillHtml = (currentQuillHtml === '<p><br></p>' || currentQuillHtml === '<p><br/></p>') ? '' : currentQuillHtml;
//             const normalizedValue = (value === null || value === undefined || value.trim() === '') ? '' : value;
//
//             // Hanya update jika nilai dari prop 'value' berbeda dari konten Quill saat ini
//             if (normalizedValue !== normalizedCurrentQuillHtml) {
//                 console.log("Updating Quill content from value prop.");
//                 // Set flag untuk mencegah `onChange` dipanggil karena update dari props ini
//                 updatingFromProps.current = true;
//                 if (normalizedValue === '') {
//                     editor.setText('');
//                 } else {
//                     // Set timeout singkat untuk memastikan DOM sudah siap, jika ada isu timing
//                     setTimeout(() => {
//                         editor.clipboard.dangerouslyPasteHTML(0, normalizedValue);
//                         updatingFromProps.current = false; // Reset flag setelah update
//                     }, 0); // Microtask queue
//                 }
//             }
//         }
//     }, [value]); // Dependensi: 'value' prop.
//
//     // --- EFFECT 3: UPDATE READONLY STATE ---
//     useEffect(() => {
//         if (quillInstanceRef.current) {
//             quillInstanceRef.current.enable(!readOnly);
//         }
//     }, [readOnly]); // Dependensi: 'readOnly' prop
//
//     return (
//         <div className="flex flex-col flex-grow h-[300px] min-h-[300px]">
//             {/* Div ini adalah target Quill untuk membangun editornya */}
//             <div ref={editorContainerRef} className="quill-editor-container" />
//         </div>
//     );
// }
//
// export default QuillEditorManual;

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
    ['link', 'image', 'video'],
    ['clean']
];

function QuillEditorManual({ value, onChange, readOnly = false, placeholder = '' }) {
    const editorContainerRef = useRef(null);
    const quillInstanceRef = useRef(null);
    const updatingFromProps = useRef(false);

    const debouncedOnChange = useCallback(() => {
        if (quillInstanceRef.current && onChange) {
            if (updatingFromProps.current) {
                return;
            }

            const html = quillInstanceRef.current.root.innerHTML;
            const cleanHtml = (html === '<p><br></p>' || html === '<p><br/></p>') ? '' : html;

            if (onChange && cleanHtml !== value) {
                onChange(cleanHtml);
            }
        }
    }, [onChange, value]);

    // --- EFFECT 1: INITIALISASI QUILL ---
    useEffect(() => {
        const editorContainer = editorContainerRef.current;
        if (!editorContainer) return;

        if (typeof window !== 'undefined' && !quillInstanceRef.current) {
            console.log("INITIALIZING QUILL INSTANCE");
            const quill = new Quill(editorContainer, {
                theme: 'snow',
                modules: {
                    toolbar: TOOLBAR_OPTIONS,
                },
                placeholder: placeholder,
                readOnly: readOnly,
            });
            quillInstanceRef.current = quill;

            updatingFromProps.current = true;
            if (value !== null && value !== undefined && value.trim() !== '') {
                quill.clipboard.dangerouslyPasteHTML(0, value);
            } else {
                quill.setText('');
            }
            updatingFromProps.current = false;

            quill.on('text-change', debouncedOnChange);
        }

        return () => {
            console.log("CLEANUP EFFECT - Removing Quill instance.");
            const quill = quillInstanceRef.current;
            if (quill) {
                quill.off('text-change', debouncedOnChange);
                quillInstanceRef.current = null;
            }

            if (editorContainer) {
                while (editorContainer.firstChild) {
                    editorContainer.removeChild(editorContainer.firstChild);
                }
            }
        };
    }, [debouncedOnChange, placeholder, readOnly, value]);


    // --- EFFECT 2: UPDATE KONTEN DARI PROP 'VALUE' ---
    useEffect(() => {
        if (quillInstanceRef.current) {
            const editor = quillInstanceRef.current;
            const currentQuillHtml = editor.root.innerHTML;

            const normalizedCurrentQuillHtml = (currentQuillHtml === '<p><br></p>' || currentQuillHtml === '<p><br/></p>') ? '' : currentQuillHtml;
            const normalizedValue = (value === null || value === undefined || value.trim() === '') ? '' : value;

            if (normalizedValue !== normalizedCurrentQuillHtml) {
                console.log("Updating Quill content from value prop.");
                updatingFromProps.current = true;
                if (normalizedValue === '') {
                    editor.setText('');
                } else {
                    setTimeout(() => {
                        editor.clipboard.dangerouslyPasteHTML(0, normalizedValue);
                        updatingFromProps.current = false;
                    }, 0);
                }
            }
        }
    }, [value]);

    // --- EFFECT 3: UPDATE READONLY STATE ---
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