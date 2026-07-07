import React, { useState, useRef } from 'react';

export default function FileUpload({ onUploadSuccess, accept = "image/*", label = "Upload Image" }) {
	const [dragActive, setDragActive] = useState(false);
	const [preview, setPreview] = useState(null);
	const fileInputRef = useRef(null);

	const handleFileProcessing = (file) => {
		if (!file) return;
    
		// Create a local memory URL for the browser to display instantly
		const localUrl = URL.createObjectURL(file);
		setPreview(localUrl);
    
		if (onUploadSuccess) {
			onUploadSuccess({ file, previewUrl: localUrl });
		}
	};

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
    
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFileProcessing(e.dataTransfer.files[0]);
		}
	};

	const handleChange = (e) => {
		e.preventDefault();
		if (e.target.files && e.target.files[0]) {
			handleFileProcessing(e.target.files[0]);
		}
	};

	return (
		<div className="w-full">
			<div 
				onDragEnter={handleDrag}
				onDragOver={handleDrag}
				onDragLeave={handleDrag}
				onDrop={handleDrop}
				onClick={() => fileInputRef.current.click()}
				className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer premium-transition flex flex-col items-center justify-center min-h-[140px] ${
					dragActive 
						? "border-brand-green bg-brand-green/5" 
						: "border-slate-800 bg-brand-surface hover:border-slate-700"
				}`}
			>
				<input 
					ref={fileInputRef}
					type="file" 
					accept={accept}
					className="hidden" 
					onChange={handleChange}
				/>

				{preview ? (
					<div className="relative group w-full flex flex-col items-center">
						<img 
							src={preview} 
							alt="Upload Preview" 
							className="w-20 h-20 object-cover rounded-lg border border-slate-700 mb-2"
						/>
						<p className="text-xs text-brand-green font-semibold">✓ Cached Locally</p>
					</div>
				) : (
					<>
						<span className="text-2xl mb-2">📁</span>
						<p className="text-xs font-semibold text-white mb-1">{label}</p>
						<p className="text-[11px] text-brand-muted">Drag & drop or click to browse</p>
					</>
				)}
			</div>
		</div>
	);
}
