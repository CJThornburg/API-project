import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import * as eventsActions from '../../store/events'

function DeleteEventModal({id}) {
    const dispatch = useDispatch();
    const his = useHistory()
    const { closeModal } = useModal();

    const handleSubmit = async () => {
     await dispatch(eventsActions.thunkDeleteEvent(id))
     await his.push('/events')
     await closeModal()
    };

    return (
        <>
            <>
                <h1>Confirm Delete</h1>
                <h3>Are you sure you want to remove this group?</h3>
                <button onClick={handleSubmit}>Yes (Delete event)</button>
                <button onClick={closeModal}>No (Keep event)</button>
            </>
        </>
    );
}

export default DeleteEventModal;
