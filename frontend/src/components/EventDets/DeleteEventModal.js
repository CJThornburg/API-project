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
            <div className='Gd-delete-pop-div'>
                <h1 className='confirm-delete'>Confirm Delete</h1>
                <h3 className='delete-text'> Are you sure you want to remove this group?</h3>
                <button  className='delete-but-yes'  onClick={handleSubmit}>Yes (Delete event)</button>
                <button className='delete-but-no'  onClick={closeModal}>No (Keep event)</button>
                </div>
            </>
        </>
    );
}

export default DeleteEventModal;
