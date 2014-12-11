# COEDIT

COEDIT is a collaborative website builder I created for my 67-328 final project at Carnegie Mellon University. I used Node.js for my framework, socket.io to transmit events between different users and the server, and MongoDB to store website code. When a user goes on the site, they need to enter a name which will then be saved in localStorage. One user is able to write HTML, and the other CSS. The two users cannot edit each other's code. Each time a user presses enter, a box on the right of the editors (below for mobile) updates with that user's current code. COEDIT is an experiment to see if strangers can build a website together without any formal communication. It also allows people to work together to code websites faster.

Users can pick a name for their website and save it to the MongoDB database. They can also load any website that has previously been saved, and edit that code as well.

The live site can be found at [coedit-duncanmcisaac1.rhcloud.com](http://coedit-duncanmcisaac1.rhcloud.com). 

*Note: COEDIT has not been tested outside of Chrome *