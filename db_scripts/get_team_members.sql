-- FUNCTION: public.get_team_member_info(integer)

DROP FUNCTION IF EXISTS public.get_team_member_info(integer);

CREATE OR REPLACE FUNCTION public.get_team_member_info(
	teammemberid integer)
    RETURNS TABLE("teamName" text, "teamDescription" text, "firstName" text, "lastName" text, username text) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
	SELECT 
    	t.name::TEXT AS "teamName",
    	t.description::TEXT AS "teamDescription", 
    	a."firstName"::TEXT AS "firstName", 
    	a."lastName"::TEXT AS "lastName", 
    	a."username"::TEXT AS "username"
    FROM team t
    LEFT OUTER JOIN team_members_app_user as tm
        ON t.id = tm."teamId"
        AND tm."appUserId" = teamMemberId
    LEFT OUTER JOIN app_user as a 
        ON tm."appUserId" = a.id
	WHERE
        t.name IS NOT NULL
        AND t.description IS NOT NULL
        AND a."firstName" IS NOT NULL
        AND a."lastName" IS NOT NULL
        AND a."username" IS NOT NULL;
END;
$BODY$;

ALTER FUNCTION public.get_team_member_info(integer)
    OWNER TO postgres;
