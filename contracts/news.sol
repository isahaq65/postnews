//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract news{
	struct newsfeed{
		address publisher;
		string newsdesc;
	}
	mapping(uint => newsfeed) public newsfeeds;
	uint public newsCount;

	function addnews(string memory newsdesc) public {
		newsCount++;
		newsfeeds[newsCount].publisher = msg.sender;
		newsfeeds[newsCount].newsdesc = newsdesc;

	}
}