# Malloci
​
*A MarkDown parser for WebVR.*
​

Malloci is a set of tool to help non-developers create Web-based VR content. Currently, creating a VR experience for the web requires a strong working knowledge of web development, game development, or both. This makes for a pretty steap learning curve, and results in a very limited amount of content.
​

Malloci attempts to lower this barrier by allowing users to create informational WebVR content using MarkDown instead.

## What is MarkDown?
​
MarkDown is a simple document formatting language, traditionally used for creating web pages. 
​
Here's some of the basic syntax:
​
```MarkDown
Headers:
​
# One Hashtag creates a Title!
## Two Makes a Section Header!
### Three Makes a Subsection Header!
​
Text styling:
​
**Two stars at the beginning and end make bold text**
​
*One star italicizes*
```
^(audio/example.m4a)
​
```MarkDown
​
images & links:
​
![alt text for an image!](the-path-or-url-to-your-image.jpg)
​
[here is a link!](https://www.markdownguide.org/cheat-sheet/)
​
Block Quotes:
​
> This is a block quote
> With more than one
> line
```
​
All so that this:
​
![Image of MarkDown code](img/md_raw.png)
​
becomes this:
​
![Image of MarkDown page](img/md_rendered.png)
​
## MarkDown in VR
​
Traditionally, MarkDown is used to generate web pages. But with Malloci, it can be leveraged to generate web exhibits! Webpages in virtual reality are rendered as rooms. These are populated with images, artefacts and text that are displayed on walls or along hallways, much like a museum.
​
​
Here is the amended syntax:
​
Headers become rooms:
```MarkDown
# One Hashtag creates a Room!
## so do Two!
### Three or more create subrooms!
```
​
Images become paintings on the wall:

```MarkDown
![alt text for an image!](the-path-or-url-to-your-image.jpg)
```
​
Block Quotes become word art:

```MarkDown
> This is a block quote
> With more than one
> line
```

So now we can generates *this*:
​
![Gif of Malloci Demo](img/VRMD.gif)
​
## Why MarkDown?
​
This question should be prefaced with another: *why is there so little WebVR content?*. There are a multitude of reasons why there is so little WebVR available, but chief amongst them is that it's very hard to create. WebVR traditionally requires extensive knowledge of JavaScript; developing a polished and optimized virtual reality experience is restricted to developers who are fluent in rather complex flavors of web technology and have domain knowledge exclusive to virtual reality. 
​
> In a bid to make webVR more accessible to both content creators who are less technically inclined, and consumers of the content itself, we've chosen to champion
> MarkDown, succinct and friendly, as our syntax of choice.
​
Malloci is platform agnostic, which means that exhibits created using Malloci can be explored on anything from phones, using a Google CardBoard headset, to any of the mid to high end headsets, such as the Oculus Go, Rift, Quest, or Valve Index. Additionally, since it is webVR, it can be viewed on a laptop, using a mouse and keyboard.
​
Encouraging this proliferation of VR has its advantages; in addition to breaking barriers to generating VR content, we want to make it available for more people to consume, too. As a medium, virtual reality lends itself to radical, creative, exciting ways of consuming content incomparable to reading text on a screen. The potential praxes are infinite.