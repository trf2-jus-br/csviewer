const Users = [
    { id: "111", name: "John Doe", email: "johnDoe@xyz.com", password: 1232, role: "user" },
    { id: "112", name: "Jane Doe", email: "janeDoe@xyz.com", password: 1234, role: "user" },
    { id: "113", name: "Jenny Doe", email: "jennyDoe@xyz.com", password: 1235, role: "admin" },
    { id: "114", name: "Jude Doe", email: "judeDoe@xyz.com", password: 2222, role: "admin" },
];

export default function handler(req, res) {
    console.log('oi')
    try {
        if (req.method !== 'POST') {
            res.status(405).send({ message: 'Only POST requests allowed' })
            return
        }
        const body = JSON.parse(JSON.stringify(req.body))
        const user = Users.find((user) => user.email === body.email && user.password === parseInt(body.password));
        if (!user) {
            res.status(404).send({ message: 'User does not exit!' })
            return
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(405).send({ message: `{error.message}` })
        return
    }
};