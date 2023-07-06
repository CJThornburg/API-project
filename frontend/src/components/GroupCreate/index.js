import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux';

function GroupCreate() {
    //   const sessionUser = useSelector(state => state.session.user);
    const [location, setLocation] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("")
    const [privacy, setPrivacy] = useState("public")
    const [img, setImg] = useState("")
    const [vaErrors, setVaErrors] = useState({})
    const his = useHistory()
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        let privateVar;
        if (privacy === "private") {
            privateVar = true
        } else { privateVar = false }

        let pin
        if (type === "In person") {
            pin = location.split(',')

        }
        const newGroup = {
            name, about, type, private: privateVar,
            city: pin[0], state: pin[1]
        }
        console.log(pin)
        console.log(newGroup)

        // his.push('/')
    }

    useEffect(() => {
        const err = {}
        if (about.length < 30) err["About"] = "Description needs 30 or more characters"
        if (type === "In person" && location === "") err["Location"] = "If group type is In person, location is required"
        
        if ((!location.includes(",") && type === "In person") || location.length < 3) err["Location2"] = "If group type is In person Location must include a comma splitting city and state, and input for both city and state"
        if (name === "") err['Name'] = "Name is required"
        if (img === "") err["Img"] = "img url is required"


        setVaErrors(err)
    }, [about, name, location, type, img])


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
                    <label htmlFor="location"></label>
                    <input
                        type="text"
                        id="location"
                        onChange={(e) => {
                            setLocation(e.target.value)
                        }}
                        placeholder="City, STATE"
                        value={location}
                    />
                    {vaErrors.Location && `* ${vaErrors.Location}`}
                    {vaErrors.Location2 && `* ${vaErrors.Location2}`}
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
                    <button className='red-but'
                        disabled={vaErrors["Name"] || vaErrors["About"] || vaErrors["Location2"] || vaErrors["Location"] || vaErrors["Img"] ? true : false}
                    >Create group</button>
                </div>
            </form>


        </>
    );
}

export default GroupCreate;
