import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../lib/hooks';
import { clearEntities, setDate } from '../../lib/reducers/entitiesReducer';
import { logout } from '../../lib/reducers/sessionReducer';
import './Header.css';

export default function Header() {

    const dispatch = useAppDispatch()

	const date = useAppSelector(state => state.entities.locations.date);

    const formattedDate = useMemo(() => {
        const formattedDate = new Date(date);
        formattedDate.setMinutes(-formattedDate.getTimezoneOffset());
        return formattedDate.toISOString().slice(0, 10);
    }, [date])

    return (
        <div id="header">
            <input 
                id="date" 
                type="date" 
                value={formattedDate} 
                onChange={e => dispatch(setDate(e.target.value))}
            />
            <div 
                tabIndex={0}
                className="button"
                onClick={() => {
                    dispatch(logout());
                    dispatch(clearEntities());
                    localStorage.removeItem('data');
                }}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        dispatch(logout());
                        dispatch(clearEntities());
                        localStorage.removeItem('data');
                    }
                }}
            >
                Log out
            </div>
        </div>
    );
}
