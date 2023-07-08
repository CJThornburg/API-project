import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import * as groupsActions from '../../store/groups'


function GroupForm({ version }) {

    const [city, setCity] = useState("");
    const [state, setState] = useState('')
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("In person")
    const [privacy, setPrivacy] = useState("public")
    const [img, setImg] = useState("")
    const [vaErrors, setVaErrors] = useState({})
    const his = useHistory()
    const dispatch = useDispatch()
    const [sub, setSub] = useState(false)

    let create = version === "create"
    let edit = version === "edit"

    // console.log(create)
    const { id } = useParams()
    // const group = useSelector(state => state.groups.singleGroup);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSub(true)

        if (Object.keys(vaErrors).length) { return }


        if (version === "create") {




            let imgCheck = await checkImage(img)

            if (!imgCheck) {

                setVaErrors({ Img: "url needs to be an image" })
                return
            }
        }
        let privateVar;
        if (privacy === "private") {
            privateVar = true
        } else { privateVar = false }

        // create
        if (version === "create") {
            const newGroup = {
                name, about, type, private: privateVar,
                city, state, img
            }


            const res = await dispatch(groupsActions.thunkCreateGroup(newGroup))


            if (res.id) {
                his.push(`/groups/${res.id}`)
            } else {
                setVaErrors(res)
            }

        } else if (version === "edit") {

            const editGroup = {
                name, about, type, private: privateVar,
                city, state, img, id
            }
            // edit
            let editRes = await dispatch(groupsActions.thunkEditGroup(editGroup))

            if (editRes.id) {
                his.push(`/groups/${editRes.id}`)
            } else {
                setVaErrors(editRes)
            }
        }
    }

    async function checkImage(url) {

        const res = await fetch(url);
        const buff = await res.blob();

        return buff.type.startsWith('image/')

    }

    useEffect(() => {
        const err = {}
        if (about.length < 50) err["About"] = "Description needs 50 or more characters"
        if (state === "") err["State"] = "State is required"

        if (state.length !== 2) err["State2"] = "State must be state abbreviation"
        if (type === "In person" && state === "") err["State3"] = "If group type is In person, State is required"

        if (type === "In person" && city === "") err["City"] = "If group type is In person, City is required"
        if (name === "") err['Name'] = "Name is required"

        if (version === "create") {
            if (img === "") err["Img"] = "img url is required"
        }

        setVaErrors(err)

    }, [about, name, state, city, type, img])

    useEffect(() => {
        async function loadGroup() {
            let group = await dispatch(groupsActions.thunkGetGroup(id));
           
            setCity(group.city)
            setState(group.state)
            setName(group.name)
            setAbout(group.about)
            setType(group.type);
            setPrivacy(group.private ? 'private' : 'public');

        }
        if (edit) loadGroup();
    }, [])




    // if(edit) {
    //     if (!Object.keys(group).length) return null
    // }

    return (
        <>


            <div className="Gc-div">
                {create && <h4 className="tealText">Start a New Group</h4>}
                {edit && <h4 className='teal-text'>UPDATE YOUR GROUP'S INFO</h4>}
                {create && <h5>We'll walk you through a few steps to build your local community</h5>}
                {edit && <h5>We'll walk you through a few steps to update your group's information</h5>}
            </div>
            <form onSubmit={handleSubmit} >


                <div className="Gc-div">
                    {create && <h5>Set your group's location</h5>}
                    {edit && <h5>Set your group's location</h5>}

                    <p>
                        OrganizeDown groups meet locally, in person, and online. We'll connect you with people in your area.
                    </p>
                    <label htmlFor="city"></label>
                    <input
                        type="text"
                        id="city"
                        onChange={(e) => {
                            setCity(e.target.value)
                        }}
                        placeholder="City"
                        value={city}
                    />
                    {vaErrors.City && sub && `* ${vaErrors.City}`}
                    {vaErrors.CityCheck && sub && `* ${vaErrors.CityCheck}`}
                    <label htmlFor="state"></label>
                    {/* if time make this a select */}
                    <input
                        type="text"
                        id="state"
                        onChange={(e) => {
                            setState(e.target.value)
                        }}
                        placeholder="STATE abbreviation"
                        value={state}
                    />
                    {vaErrors.State && sub && `* ${vaErrors.State}`}
                    {vaErrors.State2 && sub && `* ${vaErrors.State2}`}
                    {vaErrors.State3 && sub && `* ${vaErrors.State3}`}
                </div>
                <div className="Gc-div">
                    <h5>What will your group's name be?</h5>
                    {create && <p>
                        Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind
                    </p>}
                    {edit && <p>
                        Edit your name so the people will have a clear idea of what the group is about. Feel free to get creative!
                    </p>}
                    <label htmlFor="name"></label>
                    <input
                        type="text"
                        id="name"
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        placeholder="What is your group name?"
                        value={name}
                    />
                    {vaErrors.Name && sub && `* ${vaErrors.Name}`}
                </div>
                <div className="Gc-div">
                    <h5>Describe the purpose of your group.</h5>
                    <p>
                        People will see this when we promote your group, but you'll be able to add to it later, too. 1. What's the purpose of the group? 2. Who should join? 3. What will you do at your events?
                    </p>
                    <label htmlFor="about"></label>
                    <textarea
                        type="text"
                        id="about"
                        onChange={(e) => {
                            setAbout(e.target.value)
                        }}
                        placeholder="Please write at least 50 characters"
                        value={about}
                    />
                    {vaErrors.About && sub && `* ${vaErrors.About}`}
                </div>
                <div className="Gc-div">
                    <h5>Final steps...</h5>
                    <p>
                        Is this an in-person or online group?
                    </p>
                    <label htmlFor="type"></label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                    >

                        <option>
                            Online
                        </option>
                        <option>
                            In person
                        </option>
                    </select>

                    <p>
                        Is this group private or public
                    </p>
                    <label htmlFor="privacy"></label>
                    <select
                        value={privacy}
                        onChange={e => setPrivacy(e.target.value)}
                    >

                        <option>
                            public
                        </option>
                        <option>
                            private
                        </option>
                    </select>
                    {create && <>
                        <p>
                            Please add an image url for your group below
                        </p>
                        <label htmlFor="img"></label>
                        <input
                            type="text"
                            id="img"
                            onChange={(e) => {
                                setImg(e.target.value)
                            }}
                            placeholder="Image Url"
                            value={img}
                        />
                        {vaErrors.Img && sub && `* ${vaErrors.Img}`}


                    </>}


                </div>
                <div className='Gc-footer Gc-div'>
                    {create && <button className='red-but' type='submit'
                        disabled={sub && (vaErrors["Name"] || vaErrors["About"] || vaErrors["State"] || vaErrors["State2"] || vaErrors["State3"] || vaErrors["City"] || vaErrors["Img"]) ? true : false}
                    >Create group</button>}
                    {edit && <button className='red-but' type='submit'
                        disabled={sub && (vaErrors["Name"] || vaErrors["About"] || vaErrors["State"] || vaErrors["State2"] || vaErrors["State3"] || vaErrors["City"]) ? true : false}
                    >Edit Group</button>}


                </div>
            </form>


        </>
    );
}

export default GroupForm;
