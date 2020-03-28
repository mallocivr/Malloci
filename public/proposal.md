# Malloci
Creating WebVR content optimized for consumption and recall using Natural Language Processing.

![0](img/dog1.jpg)

### test subsection

![0](img/dog1.jpg)


### test again

## Description
Malloci is a tool that uses Natural Language Processing and information visualization techniques to generate WebVR content from traditional web content. This content is curated to facilitate ease of consumption for the user, across a variety of VR platforms and browsers. With the intent to eventually enable users to generate WebVR content of their own, it can also render a MarkDown based framework to greatly reduce any prerequisite knowledge to content creation. An additional feature is exploring how a WebVR environment generated from web content can be employed to teach users how they can remember it: a vehicle for the concept of building memory palaces.

## Rationale
Virtual Reality is a growing industry, but while hardware has made vast improvements in recent years, software and content have lagged behind. This can be attributed to the complexity involved in generating this kind of content. There is a steep learning curve one must overcome before they can begin creating VR content of any kind; requiring not only a fundamental understanding of software engineering and game development but also a fundamental understanding of spatial design and access to high-end hardware and software tools. This has limited VR as a medium for games, novelty experiences, and niche business applications, grossly underutilizing its potential as a tool to engage with content in immersive and productive ways.

There are obvious parallels that can be drawn to the early days of the personal computer. Steep learning curves limited PCs to business, education, and games. This changed with the introduction of the web and HTML: the web made content shareable, opening access to a wider audience, and HTML greatly reduced the knowledge necessary for creating innovative and diverse content for this audience. We aim to take a similar stab in the VR industry with the web and HTML/markdown as gateways to promoting creation and consumption of VR content.

## State of the Art

> Currently, consuming web content in VR is done either by generating WebVR content using an available framework, or a traditional web browser is rendered within the user’s
> field of vision. WebVR frameworks suffer from many of the same problems as traditional VR content creation, resulting in a relatively small amount of WebVR content, and
> rendering in a browser does not adequately leverage the immersive nature of medium.  

## Team
- Michael Gutensohn - Project Manager and VR Software Engineer
- Sharanya Soundararajan - VR Software Engineer
- Jennifer Momoh - Quantitative UX Researcher
- Masha Belyi - NLP Engineer
- Yejun Wu - VR Experience Designer

## Timeline

### Phase One (Nov 2019 - January 2020)

We will start by creating a tool that generates museum exhibits from web pages (e.g. Wikipedia articles) by associating text with representative images and symbols. We will start by researching museum layout and exhibit design, and creating a default design language for these generated spaces. Key research findings we hope to incorporate are: (1) what constitutes a memorable exhibit design, and (2) how to manipulate layout to tell a story. (3) effective methods of text representation that can be easily understood, enhancing the immersive experience of users. Based on our findings, we will generate the exhibit layout to match article formatting. Sections become rooms, and paragraphs become key locations in that room. We will also design a series of unobtrusive VR locomotions that allow users to seamlessly navigate through an exhibition (for example, choose a section of an article and jump directly to the VR exhibition of that section).

We will then implement information retrieval and natural language processing to generate exhibit content - strategically placing relevant objects and images inside the VR environment for user consumption. At a high level, we will implement an encoder that takes text as input and outputs a sequence of assets that tell the story of said text. This task can be further split into two sub-parts: (1) extraction and summarization of key concepts from Wikipedia article (2) generation relevant 2D and 3D content to render inside the exhibit. The second step will require a combination of retrieval of relevant web content (e.g. images of Abe Lincoln to tell a story about Lincoln), as well as generation of new assets, which will be the most challenging part.	