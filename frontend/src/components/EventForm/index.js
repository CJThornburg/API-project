import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import * as groupsActions from '../../store/groups'
import * as eventsActions from '../../store/events'


function EventForm() {



    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [price, setPrice] = useState(0);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [type, setType] = useState("")
    const [privacy, setPrivacy] = useState("")
    const [img, setImg] = useState("")
    const [vaErrors, setVaErrors] = useState({})
    const his = useHistory()
    const dispatch = useDispatch()
    const [sub, setSub] = useState(false)
    const [group, setGroup] = useState({})


    // console.log(create)
    const { id } = useParams()
    // const group = useSelector(state => state.groups.singleGroup);


    useEffect(() => {
        async function loadGroup() {
            let grabGroup = await dispatch(groupsActions.thunkGetGroup(id));

            setGroup(grabGroup)


        }
        loadGroup();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSub(true)

        if (Object.keys(vaErrors).length) { return }
        let privateVar;
        if (privacy === "private") {
            privateVar = true
        } else { privateVar = false }

        console.log(startTime)


        // create

        const newEvent = {
            name, about, type, price, private: privateVar,
            img, startTime, endTime, id
        }

        const res = await dispatch(eventsActions.thunkCreateEvent(newEvent))


        if (res.id) {
            his.push(`/events/${res.id}`)
        } else {
            setVaErrors(res)
        }



    }

    // useEffect(() => {
    //     const err = {}
    //     if (about.length < 50) err["About"] = "Description needs 50 or more characters"
    //     if (state === "") err["State"] = "State is required"

    //     if (state.length !== 2) err["State2"] = "State must be state abbreviation"
    //     if (type === "In person" && state === "") err["State3"] = "If group type is In person, State is required"

    //     if (type === "In person" && city === "") err["City"] = "If group type is In person, City is required"
    //     if (name === "") err['Name'] = "Name is required"

    //     if (version === "create") {
    //         if (img === "") err["Img"] = "img url is required"
    //     }

    //     setVaErrors(err)

    // }, [about, name, state, city, type, img])




    // if(edit) {
    //     if (!Object.keys(group).length) return null
    // }

    return (
        <>
            <form onSubmit={handleSubmit}>


                <div className="Gc-div">
                    <h4 className="">Create an event for "GROUP"</h4>

                    <p>What is the name of the event</p>
                    <label htmlFor="name"></label>
                    <input
                        type="text"
                        id="name"
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        placeholder="Event Name"
                        value={name}
                    />
                    {vaErrors.Name && sub && `* ${vaErrors.Name}`}
                </div>
                <div>
                        <p>Is this an in person or online event</p>
                    <label htmlFor="eventType"></label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        id="eventType"
                    >
                        <option value='' disabled>{'(Select one)'}</option>
                        <option>
                            Online
                        </option>
                        <option>
                            In person
                        </option>
                    </select>


                    <p>Is this event private or public?</p>
                    <label htmlFor="eventPrivacy"></label>
                    <select
                        value={privacy}
                        onChange={e => setPrivacy(e.target.value)}
                        id="eventPrivacy"
                    >
                        <option value='' disabled>{'(Select one)'}</option>
                        <option>
                            public
                        </option>
                        <option>
                            private
                        </option>
                    </select>


                    <p>What is the price of the event</p>
                    <label for="price"></label>
                    <input type="text" id="price" name="price" onChange={(e) => {
                        setPrice(e.target.value)

                    }}
                        placeholder='0'
                        value={price}
                    ></input>

                </div>


                <div>
                    <p>When does your event start?</p>
                    <input type='datetime-local' onChange={(e) => setStartTime(e.target.value)} value={startTime} />

                    <p>When does your event end?</p>
                    <input type='datetime-local' onChange={(e) => setEndTime(e.target.value)} value={endTime} />

                </div>
                <div>
                    <p>Please add an image url for your event below:</p>
                    <input placeholder='Image URL' value={img} onChange={(e) => setImg(e.target.value)} />

                </div>
                <div>
                    <p>Please describe you event:</p>
                    <textarea placeholder='Please write at least 50 characters' onChange={(e) => setAbout(e.target.value)} value={about} />

                </div>
                <button type='submit'>Create Event</button>

            </form>
        </>

    );
}

export default EventForm;
