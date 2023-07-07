import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import * as groupsActions from '../../store/groups'

function GroupCreate() {
    //   const sessionUser = useSelector(state => state.session.user);
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
    const group = useSelector(state => state.groups.singleGroup);

    const handleSubmit = async (e) => {
        // e.preventDefault()
        let privateVar;
        if (privacy === "private") {
            privateVar = true
        } else { privateVar = false }



        const newGroup = {
            name, about, type, private: privateVar,
            city, state, img
        }

        console.log(newGroup)
        const res = await dispatch(groupsActions.thunkCreateGroup(newGroup)).then(his.push(`/groups/${group.id}`))

        console.log("hi", res)
        console.log("group ID BEFORE PUSH", group.id)
        his.push(`/groups/${res.id}`)
    }

    useEffect(() => {
        const err = {}
        if (about.length < 30) err["About"] = "Description needs 30 or more characters"
        if (state === "") err["State"] = "State is required"
        console.log(state.length === 2)
        if (state.length !== 2) err["State2"] = "State must be state abbreviation"
        if (type === "In person" && state === "") err["State3"] = "If group type is In person, State is required"

        if (type === "In person" && city === "") err["City"] = "If group type is In person, City is required"
        if (name === "") err['Name'] = "Name is required"
        if (img === "") err["Img"] = "img url is required"

        setVaErrors(err)
    }, [about, name, state, city, type, img])


    return (
        <>
            <div className="Gc-div">
                <h4 className="tealText">Start a New Group</h4>
                <h5>We'll wall you through a few steps to build your local community</h5>
            </div>
            <form onSubmit={handleSubmit} >


                <div className="Gc-div">
                    <h5>Set your group's location</h5>
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
                    {vaErrors.City && `* ${vaErrors.City}`}
                    {vaErrors.CityCheck && `* ${vaErrors.CityCheck}`}
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
                    {vaErrors.State && `* ${vaErrors.State}`}
                    {vaErrors.State2 && `* ${vaErrors.State2}`}
                    {vaErrors.State3 && `* ${vaErrors.State3}`}
                </div>
                <div className="Gc-div">
                    <h5>What will your group's name be?</h5>
                    <p>
                        Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind
                    </p>
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
                    {vaErrors.Name && `* ${vaErrors.Name}`}
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
                        placeholder="Please write at least 30 characters"
                        value={about}
                    />
                    {vaErrors.About && `* ${vaErrors.About}`}
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
                    {vaErrors.Img && `* ${vaErrors.Img}`}


                </div>
                <div className='Gc-footer Gc-div'>
                    <button className='red-but' type='submit'
                        disabled={vaErrors["Name"] || vaErrors["About"] || vaErrors["State"] || vaErrors["State2"] || vaErrors["State3"] || vaErrors["City"] || vaErrors["Img"] ? true : false}
                    >Create group</button>
                </div>
            </form>


        </>
    );
}

export default GroupCreate;
