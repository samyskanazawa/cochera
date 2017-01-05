package ejecucion;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public final class DateUtils {    

    public static final String DB_FORMAT_DATETIME = "yyyy-MM-dd HH:mm:ss";        

    private DateUtils() {
        // not publicly instantiable
    }       

    public static Date getDate(String dateStr) {
    	
    	String[] parts = dateStr.split("T");
    	
        final DateFormat formatter = new SimpleDateFormat(DB_FORMAT_DATETIME);
        try {
            return formatter.parse(parts[0] + " 00:00:00");
        } catch (ParseException e) {                
            return null;
        }
    }



} 
