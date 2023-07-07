import { useHistory } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import * as groupsActions from '../../store/groups'

function DeleteGroupModal({id}) {
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
                <h1>Confirm Delete</h1>
                <h3>Are you sure you want to remove this group?</h3>
                <button onClick={handleSubmit}>Yes (Delete group)</button>
                <button onClick={closeModal}>No (Keep group)</button>
            </>
        </>
    );
}

export default DeleteGroupModal;
