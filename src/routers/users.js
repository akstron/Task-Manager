const express = require('express')
const User = require('../models/users')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req, res) => {
    try{
        req.user.tokens = []

        await req.user.save()

        res.send()
    } catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth ,async (req, res) => {
    res.send(req.user) 
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['age', 'email', 'name', 'password']
    const isValidOperation = updates.every((update) => allowedUpdate.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid operation!'})
    }

    /* If we try to update keys which do not occur in req.body, mongoose simply ignores it.
    Above code is just for user information that provided values are not valid */

    try{
        // const user = await User.findById(req.params.id)
        const user = req.user

        /*Below is bracket notation for accessing keys whose name we don't know*/
        updates.forEach((update) => user[update] = req.body[update])

        await user.save()

        /* The below findByIdAndUpdate will bypass mongoose midleware, so we won't be
        able to hash password, thats why we are updating values traditionally */
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        res.send(user);
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // res.send(user)

        await req.user.remove()
        res.send(req.user)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken()
        res.send({user, token})
    }
    catch(e) {
        res.status(400).send()
    }
})

module.exports = router