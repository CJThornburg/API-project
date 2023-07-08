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

        let imgCheck = await checkImage(img)

        if (!imgCheck) {

            setVaErrors({ Img: "url needs to be an image" })
            return
        }





        let privateVar;
        if (privacy === "private") {
            privateVar = true
        } else { privateVar = false }




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

    async function checkImage(url) {

        const res = await fetch(url);
        const buff = await res.blob();

        return buff.type.startsWith('image/')

    }
    useEffect(() => {
        const err = {}

        if (name.length < 5) err['Name'] = "Name must be at least 5 characters "
        if (type === "") err["Type"] = "Event Type is required"
        if (privacy === "") err["Privacy"] = "Visibility is required"
        if (price === "") err["Price"] = "Price is required"
    
        if (new Date(endTime).getTime() < new Date(startTime).getTime()) err["EndDate"] = "End date must be after start date"



        if (new Date().getTime() > new Date(startTime).getTime()) err["StartDate"] = "Start date must be after right now"
        if (img === "") err["Img"] = "img url is required"
        if (about.length < 50) err['About'] = "Description needs to be at least 50 characters"
        setVaErrors(err)

    }, [about, name, startTime, endTime, price, privacy, type, img])




    // if(edit) {
    //     if (!Object.keys(group).length) return null
    // }

    return (
        <>
            <form onSubmit={handleSubmit}>


                <div className="Gc-div">
                    <h4 className="">Create an event for {group.name}</h4>

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
                    {vaErrors.Type && sub && `* ${vaErrors.Type}`}

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
                    {vaErrors.Privacy && sub && `* ${vaErrors.Privacy}`}

                    <p>What is the price of the event</p>
                    <label for="price"></label>
                    <input type="text" id="price" name="price" onChange={(e) => {
                        setPrice(e.target.value)

                    }}
                        placeholder='0'
                        value={price}
                    ></input>
                    {vaErrors.Price && sub && `* ${vaErrors.Price}`}
                </div>


                <div>
                    <p>When does your event start?</p>
                    <input type='datetime-local' onChange={(e) => setStartTime(e.target.value)} value={startTime} />
                    {vaErrors.StartDate && sub && `* ${vaErrors.StartDate}`}
                    <p>When does your event end?</p>
                    <input type='datetime-local' onChange={(e) => setEndTime(e.target.value)} value={endTime} />
                    {vaErrors.EndDate && sub && `* ${vaErrors.EndDate}`}

                </div>
                <div>
                    <p>Please add an image url for your event below:</p>
                    <input placeholder='Image URL' value={img} onChange={(e) => setImg(e.target.value)} />
                    {vaErrors.Img && sub && `* ${vaErrors.Img}`}
                </div>
                <div>
                    <p>Please describe you event:</p>
                    <textarea placeholder='Please write at least 50 characters' onChange={(e) => setAbout(e.target.value)} value={about} />
                    {vaErrors.About && sub && `* ${vaErrors.About}`}
                </div>
                <button type='submit'
                disabled={sub && (vaErrors["Name"] || vaErrors["About"] || vaErrors["StartDate"] || vaErrors["EndDate"] || vaErrors["Img"] || vaErrors["Price"] || vaErrors["Privacy"] || vaErrors["Type"]) ? true : false}
                >Create Event</button>

            </form>
        </>

    );
}

export default EventForm;
