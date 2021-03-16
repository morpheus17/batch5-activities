def disemvowel(string)
    string_array = string.split("")
    vowels = "AEIOUaeiou"
    i = 0
    while i < string.length
      if vowels.include?(string[i])
        string_array[i] =  " "
      end
      i +=1
    end
  
    new_string = string_array.join
    new_string = new_string.gsub(/\s+/,"")
    return new_string
  end

  puts disemvowel("heheheheheh")