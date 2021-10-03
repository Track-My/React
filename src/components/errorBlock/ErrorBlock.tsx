import { SessionError } from '../../lib/reducers/sessionReducer';
import './ErrorBlock.css'

interface ErrorBlockProp {
    error: SessionError
}

export default function ErrorBlock({ error }: ErrorBlockProp) {
    return (
        <div className="error-block">
            {error.message}
        </div>
    );
}
