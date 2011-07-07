var tagMap = {
	h: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7'],
	l: ['a'],
	f: ['form', 'input', 'textarea', 'label', 'fieldset', 'legend', 'select', 
		'optgroup', 'option', 'button'], 
	p: ['p']
}

var _last_

$.fn.isBefore = function(e) {
	return this.add(e).index(e) > 0
}

$(document).keydown(kb)

function kb(e){
	if(e.altKey && e.ctrlKey && e.which != 17 && e.which != 18){
		navigate(String.fromCharCode(e.which).toLowerCase(), _last_ || document.body, e.shiftKey)
	}
}

function navigate(key, target, backwards){
	if(!tagMap[key]) return
	var current = findFirstTagAfterElement(tagMap[key], target, backwards)
	if(current){
		$(current).focus()
		$('html, body').scrollTop($(current).offset().top)
		$('html, body').scrollLeft($(current).offset().left)
		$(current).addClass('keybrowser-selected')
		if(current != _last_){
			if(_last_) $(_last_).removeClass('keybrowser-selected')
		}
		_last_ = current
	}
}

// finds the "next" (DOM-ordered) element of a given tag name
function nextTagFromElement(tag, e, backwards){
	var tags = document.getElementsByTagName(tag)
	
	// when fetching tags of the same kind, just use the pre-built array
	if(e.tagName.toLowerCase() == tag.toLowerCase()){
		var pos = $.inArray(e, tags)
		if(pos >= tags.length - 1 && !backwards) pos = -1
		if(pos == 0 && backwards) pos = tags.length
		
		if(backwards){
			console.log('--', tags[pos - 1])
			return tags[pos - 1]
		} else {
			return tags[pos + 1]
		}
	}
	
	// otherwise, use isBefore
	if(!backwards){
		for(var i = 0; i < tags.length; i++){
			if(!$(tags[i]).isBefore($(e))){
				return tags[i]
			}
		}
		return tags[0] // return the first on search failure
	} else {
		for(i = tags.length - 1; i >= 0; i--){
			if($(tags[i]).isBefore($(e))){
				return tags[i]
			}
		}

		return tags[tags.length - 1] // return the last on search failure
	}
	

}

// among, for example, [h1, h2, h3], finds the next DOM element that is one of the set
function findFirstTagAfterElement(tags, e, backwards){
	var closest = undefined
	
	for(var i = 0; i < tags.length; i++){
		var current = nextTagFromElement(tags[i], e, backwards)
		if(!current || current == e) continue
		if(!backwards){
			if(!$(current).isBefore($(e)) && current != e){
				if(!closest || $(current).isBefore($(closest))) closest = current
			}
		} else { // searching backwards
			if($(current).isBefore($(e))){
				if(!closest || !$(current).isBefore($(closest))) closest = current
			}
		}
	}
	
	if(closest) return closest
	
	for(i = 0; i < tags.length; i++){
		current = nextTagFromElement(tags[i], e, backwards)
		if(!current || current == e) continue
		if(!backwards){
			if($(current).isBefore($(e))){
				if(!closest || $(current).isBefore($(closest))) closest = current
			}
		} else { // searching backwards
			if(!$(current).isBefore($(e)) && current != e){
				if(!closest || !$(current).isBefore($(closest))) closest = current
			}
		}
	}
	
	if(!closest) closest = e
	return closest
}

