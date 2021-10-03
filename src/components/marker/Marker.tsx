import { useState } from 'react';
import './Marker.css';

interface MarkerProps {
	lat: number;
	lng: number;
	date: string;
	selected: boolean;
	onSelect: () => void;
}

export default function Marker({ date, selected, onSelect }: MarkerProps){

	const [isMouseOver, setIsMouseOver] = useState(false);

	return (
		<div
			className="marker-block" 
			onMouseEnter={_ => setIsMouseOver(true)} 
			onMouseLeave={_ => setIsMouseOver(false)}
		>
			<div
				tabIndex={0}
				onClick={onSelect}
				onKeyPress={(e) => {
					if (e.key === 'Enter') {
						onSelect();
					}
				}}
				className={ selected ? 'marker-selected' : 'marker' }
			>
			</div> 
			{(isMouseOver || selected) && (
				<div className="marker-label">
					{ new Date(date).toLocaleTimeString().slice(0, 5) }
				</div>
			)}
		</div>
		
	);
}
