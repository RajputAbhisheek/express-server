export const getExample = (req, res) => {
    res.send('This is an example response from the controller.');
};

export const postExample = (req, res) => {
    const data = req.body;
    res.status(201).json({ message: 'Data received', data });
};