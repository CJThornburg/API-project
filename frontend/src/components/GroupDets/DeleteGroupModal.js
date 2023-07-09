import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import * as groupsActions from '../../store/groups'

function DeleteGroupModal({ id }) {
    const dispatch = useDispatch();
    const his = useHistory()
    const { closeModal } = useModal();

    const handleSubmit = async () => {
        await dispatch(groupsActions.thunkDeleteGroup(id))
        await his.push('/groups')
        await closeModal()
    };

    return (
        <>
            <>
                <div className='Gd-delete-pop-div'>

                    <h1 className='confirm-delete'>Confirm Delete</h1>
                    <h3 className='delete-text'>Are you sure you want to remove this group?</h3>
                    <button  className='delete-but-yes ' onClick={handleSubmit}>Yes (Delete group)</button>
                    <button  className='delete-but-no' onClick={closeModal}>No (Keep group)</button>



                </div>
            </>
        </>
    );
}

export default DeleteGroupModal;
